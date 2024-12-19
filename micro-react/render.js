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

// 发出第一个fiber root fiber
function render(element, container) {
  // 初始化第一次工作
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    sibiling: null,
    child: null,
    parent: null,
  };
  nextUnitOfWork = wipRoot;
}


let nextUnitOfWork = null;

let wipRoot = null;

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibiling);
}

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

  //commit 阶段
  if(!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

// 第一次请求
requestIdleCallback(workLoop)

function performUnitOfWork(fiber){
  //创建dom元素
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }

  // //追加到父节点
  // if(fiber.parent) {
  //   fiber.parent.dom.append(fiber.dom)
  // }

  //给children新建fiber
  const elements = fiber.props.children;
  let prevSibling = null;

  //建立fiber之间的联系，构建Fiber Tree
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
      //第一个就是child
      fiber.child = newFiber;
    } else {
      //否则是兄弟
      prevSibling.sibiling = newFiber;
    }
    // 建立兄弟之间的指向
    prevSibling = newFiber;
  }
  // 返回下一个fiber
  if(fiber.child) {
    return fiber.child;
  } 
  let nextFiber = fiber;
  while (nextFiber) {
    if(nextFiber.sibiling) {
      return nextFiber.sibiling
    }
    nextFiber = nextFiber.parent;
  }
}




export default render;
