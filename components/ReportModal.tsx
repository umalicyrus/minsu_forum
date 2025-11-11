"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type ReportModalProps = {
  open: boolean;
  onClose: () => void;
  questionId?: number;
  answerId?: number;
};

export default function ReportModal({
  open,
  onClose,
  questionId,
  answerId,
}: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [alreadyReported, setAlreadyReported] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // ✅ second modal

  // Check if user already reported this question
  useEffect(() => {
    const checkReport = async () => {
      if (!questionId) return;
      try {
        const res = await fetch(`/api/questions/${questionId}/report/check`);
        if (res.ok) {
          const data = await res.json();
          setAlreadyReported(data.reported);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkReport();
  }, [questionId]);

  const handleSubmit = async () => {
    if (alreadyReported) return alert("You have already reported this content.");

    const finalReason = reason === "Other" ? customReason : reason;
    if (!finalReason) return alert("Please select or specify a reason.");

    try {
      const res = await fetch(`/api/questions/${questionId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: finalReason, answerId }),
      });

      if (!res.ok) {
        const data = await res.json();
        return alert(data.error || "Failed to submit report");
      }

      // ✅ Instead of alert, show the confirmation modal
      setShowConfirmation(true);
      setAlreadyReported(true);
      setReason("");
      setCustomReason("");
      onClose(); // close the main report modal
    } catch (error) {
      console.error(error);
      alert("Error submitting report");
    }
  };

  return (
    <>
      {/* Main Report Modal */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg p-6 rounded-2xl bg-green-50 border border-green-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-green-800">
              Report Content
            </DialogTitle>
          </DialogHeader>

          <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-sm text-green-800 space-y-1 mt-2">
            <p className="font-medium">💡 Tips before reporting:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Only report content that violates rules</li>
              <li>Provide a clear reason if choosing "Other"</li>
              <li>Double-check before submitting</li>
            </ul>
          </div>

          <div className="space-y-4 mt-4">
            <RadioGroup value={reason} onValueChange={setReason}>
              {["Spam", "Inappropriate content", "Harassment", "Misinformation", "Other"].map(
                (r) => (
                  <div key={r} className="flex items-center space-x-2">
                    <RadioGroupItem value={r} id={r} />
                    <Label htmlFor={r} className="text-green-800">
                      {r}
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>

            {reason === "Other" && (
              <Textarea
                placeholder="Please describe the issue..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="border border-green-300 focus:ring-2 focus:ring-green-400 bg-white rounded-lg"
              />
            )}
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-green-400 text-green-700 hover:bg-green-100"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              className={`text-white ${
                alreadyReported
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              onClick={handleSubmit}
              disabled={alreadyReported || (!reason && !customReason)}
            >
              {alreadyReported ? "Already Reported" : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-green-50 border border-green-200 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-green-800">
              Report Submitted
            </DialogTitle>
          </DialogHeader>
          <p className="mt-4 text-green-900 text-sm">
            Thank you for your report. The admin will examine your report shortly.
          </p>
          <DialogFooter className="mt-6 flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowConfirmation(false)}
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
