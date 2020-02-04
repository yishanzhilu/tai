# Scope

`contexts` 目录其下每个文件夹为一个 `scope` ， `scope` 下可以有子文件夹，即为子 `scope`。

`global` 是特殊的全局 `scope`，会在 `_app.tsx` 中是引入。任何组件（包括 `page` 组件）都可以使用其中的 context。

## Scope Contexts

一个 `scope` 中会有多个 `context` ，保证 `context` 的颗粒度尽量小，从而使单个 `context` 的更新不会触发无效的组件更新。

## Workspace 举例

对于单个 `context，例如` `workspace`, 其下有自己的 `workspace.tsx` 文件和 `components` 文件夹。
`workspace.tsx` 是提供当前 `context` 的入口，可以在 `pages` 文件中使用。
`components` 文件夹的作用是保证只有此文件夹下的 `component` 可以使用当前的 `context`，保证不会因为没有在 `Provider` 下出现`useContext` 失败的情况。
