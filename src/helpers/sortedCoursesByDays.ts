import { Course } from "../model/courseModel";

export const sortedCoursesByDays = async (coursesLastAll: Record<string, any>[]) => {
    const resultSortDay: Record<string, any>[] = [];
    for (let i = 0; i < coursesLastAll.length; i++) {
      if (coursesLastAll[i].date.getDate() === new Date().getDate()) return;
      const coursesOneDay = await Course.getCoursesOneDay(coursesLastAll[i].date);
      const coursesDaySortDate = coursesOneDay.sort((item) => item.date);
      const openCourses = coursesDaySortDate[0];
      const closeCourses = coursesDaySortDate.at(-1);
      
      const sortedCourseDay = coursesOneDay.sort((elem: Record<string, any>) => elem[coursesLastAll[i].name_coin]);
      resultSortDay.push(
        {
          date: closeCourses.created_at,
          name_coin: coursesLastAll[i].name_coin,
          open_course: openCourses[coursesLastAll[i].name_coin],
          close_course: closeCourses[coursesLastAll[i].name_coin],
          min_course: sortedCourseDay[0][coursesLastAll[i].name_coin],
          max_course: sortedCourseDay.at(-1)[coursesLastAll[i].name_coin],
        }
      ) 
    }
    return resultSortDay;
}