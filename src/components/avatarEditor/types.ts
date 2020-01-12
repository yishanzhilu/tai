/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

export interface IAvatarEditorProps {
  /**
   * The Image object to display
   */
  img?: HTMLImageElement;

  /**
   * The url ot base64 string to load
   * (use urls from your domain to prevent security errors)
   */
  src?: string;

  /**
   * The width of the editor
   */
  width?: number;

  /**
   * The height of the editor (image will fit to this height)
   */
  height?: number;

  /**
   * The desired width of the image, can not be used together with imageHeight
   */
  imageWidth?: number;

  /**
   * The desired height of the image, can not be used together with imageWidth
   */
  imageHeight?: number;

  /**
   * The crop area radius in px (
   * @default 100
   */
  cropRadius?: number;

  /**
   * The crop border color
   * @default 'white'
   */
  cropColor?: string;

  /**
   * The crop border width
   * @default 4
   */
  lineWidth?: number;

  /**
   * The min crop area radius in px
   * @default 30
   */
  minCropRadius?: number;

  /**
   * The color of the image background
   * @default 'white'
   */
  backgroundColor?: string;

  /**
   * The close button color
   * @default 'white'
   */
  closeIconColor?: string;

  /**
   * The shading color
   * @default 'grey'
   */
  shadingColor?: string;

  /**
   * The shading area opacity
   * @default 0.6
   */
  shadingOpacity?: number;

  /**
   * The mime types used to filter loaded files
   * @default 'image/jpeg, image/png'
   */
  mimeTypes?: string;

  /**
   * scale speed when use mobile
   * @default 0.5
   */
  mobileScaleSpeed?: number;

  /**
   * Label text
   * @default '请选择文件'
   */
  label?: string;

  /**
   * The style object for preview label
   */
  labelStyle?: React.CSSProperties;

  /**
   * The style for object border preview
   */
  borderStyle?: React.CSSProperties;

  /**
   * Invoked when image based on src prop finish loading
   */
  onImageLoad?: (data: HTMLImageElement) => void;

  /**
   * Invoked when user drag&drop event stop
   * and return croped image in base64 sting
   */
  onCrop?: (data: string) => void;

  /**
   * Invoked when user upload file with internal file loader
   */
  onBeforeFileLoad?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Invoked when user upload file with internal file loader
   */
  onFileLoad?: (data: React.ChangeEvent<HTMLInputElement> | File) => void;

  /**
   * Invoked when user clock on close editor button
   */
  onClose?: () => void;
}

export interface IAvatarEditorState {
  imgWidth: number;
  imgHeight: number;
  scale: number;
  containerId: string;
  loaderId: string;
  lastMouseY: number;
  showLoader: boolean;
  image: HTMLImageElement;
  file: File;
  cropRadius: number;
}
