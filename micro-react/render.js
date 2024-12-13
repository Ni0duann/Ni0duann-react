function createDom(fiber) {
  // 创建元素
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  //赋予属性
  Object.keys(fiber.props)
    .filter((key) => key !== "children")
    .forEach((key) => (dom[key] = fiber.props[key]));

  // //递归渲染子元素
  // element.props.children.forEach((child) => render(child, dom));

  return dom;
}

function render(element, container) {
  // 初始化第一次工作
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
    sibiling: null,
    child: null,
    parent: null,
  }
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

function performUnitOfWork(fiber){
  //创建dom元素
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  //追加到父节点
  if(fiber.parent) {
    fiber.parent.dom.append(fiber.dom)
  }

  //给children新建fiber
  const elements = fiber.props.children;
  let prevSibling = null;

  for(let i = 0;i< elements.length;i++){
    const newFiber = {
      type: elements[i].type,
      props: elements[i].props,
      parent: fiber,
      dom: null,
      child: null,
      sibiling: null,
    };
    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibiling = newFiber;
    }
    prevSibling = newFiber;
  }
}


export default render;
