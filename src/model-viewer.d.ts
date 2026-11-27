import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type ModelViewerProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  src?: string
  poster?: string
  alt?: string
  'camera-controls'?: boolean
  'disable-zoom'?: boolean
  'disable-pan'?: boolean
  'touch-action'?: string
  'auto-rotate'?: boolean
  'shadow-intensity'?: string
  'shadow-softness'?: string
  exposure?: string
  'tone-mapping'?: string
  'environment-image'?: string
  'skybox-image'?: string
  'interaction-prompt'?: string
  'camera-orbit'?: string
  'field-of-view'?: string
  'min-camera-orbit'?: string
  'max-camera-orbit'?: string
  'min-field-of-view'?: string
  'max-field-of-view'?: string
  ref?: import('react').Ref<HTMLElement>
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerProps
    }
  }
}
