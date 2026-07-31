import Calendar from "@/components/Calendar";
import { getTasks } from "@/lib/actions";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="p-6 flex">
      <Calendar tasks={tasks} />
      <ul>
        <li>
          things left to do:
          <ul>archive tasks</ul>
          <ul>translate to bulgarian</ul>
        </li>
      </ul>
    </div>
  );
}
