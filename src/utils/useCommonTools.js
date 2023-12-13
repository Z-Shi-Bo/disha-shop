export function requireAssetsImg(url) {
  return new URL(`../assets/images/${url}`, import.meta.url).href;
}

// 处理当前状态
export function useFormatStatus(row) {
  let s = '领取中';
  const start_time = new Date(row.start_time).getTime();
  const now_time = new Date().getTime();
  const end_time = new Date(row.end_time).getTime();
  if (start_time > now_time) {
    s = '未开始';
  } else if (end_time < now_time) {
    s = '已结束';
  } else if (row.status === 0) {
    s = '已失效';
  }
  return s;
}

// 将query参数转化为对象
export function useParseQuery(query) {
  let url = [];
  for (const key in query) {
    if (Object.hasOwnProperty.call(query, key)) {
      if (query[key]) {
        url.push(`${key}=${encodeURIComponent(query[key])}`);
      }
    }
  }
  return url.join('&');
}

// 将参数转化为数组
export function useParseArray(ids) {
  return Array.isArray(ids) ? ids : [ids];
}

// 上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1);
}
// 下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1);
}
// 处理函数
function swapArray(arr, index1, index2) {
  // 下面两个方法等效的
  // arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  arr[index2] = arr.splice(index1, 1, arr[index2])[0];
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    (a, b) => {
      let ret = [];
      a.forEach((a1) => {
        b.forEach((b1) => {
          ret.push(a1.concat([b1]));
        });
      });
      return ret;
    },
    [[]]
  );
}

// 导出函数
export function useExport(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', filename + '.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
