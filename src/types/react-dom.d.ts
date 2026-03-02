declare module 'react-dom' {
  export * from 'preact/compat'
  export { default } from 'preact/compat'
}

declare module 'react-dom/*' {
  export * from 'preact/compat'
  export { default } from 'preact/compat'
}
