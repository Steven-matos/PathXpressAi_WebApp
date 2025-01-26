import Calendar from "../components/Calendar";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Route Scheduler</h1>
      <Calendar />
    </main>
  );
}
