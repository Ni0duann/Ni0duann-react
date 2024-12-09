function render(element, container) {
  // 创建元素
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  //赋予属性
  Object.keys(element.props)
    .filter((key) => key !== "children")
    .forEach((key) => (dom[key] = element.props[key]));

  // //递归渲染子元素
  // element.props.children.forEach((child) => render(child, dom));

  //追加到父节点
  container.append(dom);
}

let nextUnitOfWork = null;

//调度函数
function workLoop(deadLine) {
  // 应该退出
  let shoulYield = false;
  // 执行条件
  while(nextUnitOfWork && !shoulYield){
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    // 检查时间
    shoulYield = deadLine.timeRemaining() < 1;

  }
  // 没有时间就请求下一次
  requestIdleCallback(workLoop)
}

// 第一次请求
requestIdleCallback(workLoop)

function performUnitOfWork(work){}


export default render;
