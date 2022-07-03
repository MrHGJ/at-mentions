# at mentions 

> * @编辑器：基于contentEditable实现，除了普通文本输入，还支持@选人功能。
> * @结果展示：支持人员高亮，点击人员展示人员信息卡片(可自定义内容)。
> * demo页：左侧@编辑器输入框，右侧结果展示。

![](./demo/demo-2.png)
![](./demo/demo-5.png)


## 功能特性

**@编辑器组件**

* 支持任意普通文本输入
* 支持@选人功能
* 支持@人员高亮展示
* 支持@人员整体删除
* 支持上下键选人
* 支持关键字模糊匹配
* 支持placeholder
* 支持输入文本最大字符数限制
* 支持复制粘贴

**@结果展示组件**
*  支持@人员高亮展示
*  支持@人员点击事件
*  支持@人员点击展示个人卡片

**Tip： 可以根据自己业务需求调整@人员携带的数据信息，可以自定义个人卡片展示内容**

## 运行
1. git clone 项目
2. npm i
3. npm run start


## 代码结构
* 主要由三部分构成：@编辑器组件、结果展示组件、使用demo页面。

```tree
.
├── src                           
│   ├── components                 
│   │   ├── at-mentions           # @编辑器组件
│   │   ├── at-mentions-preview   # 结果展示组件
│
│   ├── views                 
│   │   ├── home                  # 首页。组件使用demo。
│
└── README.md
```


## 相关文章

待补充

