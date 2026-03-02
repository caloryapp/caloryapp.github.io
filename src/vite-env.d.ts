declare module '*.svg?react' {
  import type { FunctionalComponent, JSX } from 'preact'

  const SvgComponent: FunctionalComponent<JSX.SVGAttributes<SVGSVGElement>>
  export default SvgComponent
}
