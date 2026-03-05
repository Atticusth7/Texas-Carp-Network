import CatchForm from "@/components/catches/CatchForm";

export default function NewCatchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <h1 className="section-title mb-2">Log a Catch</h1>
      <p className="text-gray-500 mb-8">Record your catch with gear details and water conditions.</p>
      <CatchForm />
    </div>
  );
}
