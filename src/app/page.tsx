import Calendar from "@/components/Calendar";
import { getTasks } from "@/lib/actions";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="p-6">
      <Calendar />
    </div>
  );
}
