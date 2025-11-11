// scripts/backfillSlugs.ts
import prisma from "../lib/prisma";
import slugify from "slugify";

async function backfillSlugs() {
  try {
    // ✅ Get all questions (filtering manually to avoid type errors)
    const allQuestions = await prisma.question.findMany();

    // ✅ Filter only those missing a slug
    const questionsWithoutSlug = allQuestions.filter(
      (q) => !q.slug || q.slug.trim() === ""
    );

    console.log(`Found ${questionsWithoutSlug.length} questions without slugs.`);

    for (const q of questionsWithoutSlug) {
      const generatedSlug =
        slugify(q.title || `question-${q.id}`, { lower: true, strict: true }) ||
        `question-${q.id}`;

      await prisma.question.update({
        where: { id: q.id },
        data: { slug: generatedSlug },
      });

      console.log(`✅ Updated question ID ${q.id} → ${generatedSlug}`);
    }

    console.log("🎉 All slugs backfilled successfully!");
  } catch (err) {
    console.error("❌ Error while backfilling slugs:", err);
  } finally {
    await prisma.$disconnect();
  }
}

backfillSlugs();
