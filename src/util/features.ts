export const format = (time: Date | string, form: string) => {
  const dateTime = new Date(time);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth();
  const date = dateTime.getDate();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const second = dateTime.getSeconds();
  const millisecond = dateTime.getMilliseconds();
  const padding = (num: number, pad: number) =>
    num.toString().padStart(pad, "0");
  return form.replace(/YYYY|MM|dd|HH|mm|ss|SSS|AP/g, ($1) => {
    switch ($1) {
      case "YYYY":
        return padding(year, 4);
      case "MM":
        return padding(month + 1, 2);
      case "dd":
        return padding(date, 2);
      case "HH":
        return padding(hour, 2);
      case "mm":
        return padding(minute, 2);
      case "ss":
        return padding(second, 2);
      case "SSS":
        return padding(millisecond, 3);
      default:
        return $1;
    }
  });
};
