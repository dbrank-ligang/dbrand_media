/**
 *  @rule 小数转百分比 四舍五入-保留两位小数
 */
// export function numFilter(data) {
//   let data1 = data * 100 + "%";
//   return data1;
// }
export function numFilter(data) {
  let data1 = (data * 100).toFixed(2);
  return data1 + "%";
}
