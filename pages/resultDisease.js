import { useRouter } from "next/router";

export default function ResultDisease() {
  const router = useRouter();
  const { class: diseaseClass, confidence } = router.query;

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold">Prediction Result</h2>
      <p><strong>Class:</strong> {diseaseClass || "N/A"}</p>
      <p><strong>Confidence:</strong> {confidence ? `${confidence}%` : "N/A"}</p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Back to Upload
      </button>
    </div>
  );
}
