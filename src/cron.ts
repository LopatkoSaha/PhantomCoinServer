import cron from "node-cron";
import { CoursesHistory } from "./model/coursesHistoryModel";
import { sortedCoursesByDays } from "./helpers/sortedCoursesByDays";

cron.schedule("0 0 * * *", () => {
  sortedDb();
});

async function sortedDb() {
  // найти последние записи в базе истории курсов по всем валютам
  const coursesLastAll = await CoursesHistory.getLastCoursesHistory();

  // делаем выборку из БД текущих курсов за каждый следующий день от последней записи за год
  // и приводим данные к нужному формату 
  const resultSortDays = await sortedCoursesByDays(coursesLastAll);
  
  // записываем в БД за год
  await CoursesHistory.setLastCoursesHistory(resultSortDays!);
  
  // очищаем БД за день от устаревших данных???
}
