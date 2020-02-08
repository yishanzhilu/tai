/**
 * Copyright (c) 2019 Yishan Authors
 *
 * All rights reserved
 */

// Fork from https://github.com/kirill3333/react-avatar.git
// author: Kirill Novikov
// email: kirill3333@inbox.ru
// license: MIT
// homepage: https://github.com/kirill3333/react-avatar#readme

/* eslint-disable */
import React from 'react';
import Konva from 'konva';
import { IAvatarEditorState, IAvatarEditorProps } from './types';

class AvatarEditor extends React.Component<
  IAvatarEditorProps,
  IAvatarEditorState
> {
  static defaultProps = {
    shadingColor: 'grey',
    shadingOpacity: 0.6,
    cropColor: 'white',
    closeIconColor: 'white',
    lineWidth: 4,
    minCropRadius: 30,
    backgroundColor: 'grey',
    mimeTypes: 'image/jpeg,image/png',
    mobileScaleSpeed: 0.5, // experimental
    onClose: () => {},
    onCrop: () => {},
    onFileLoad: () => {},
    onImageLoad: () => {},
    onBeforeFileLoad: () => {},
    label: '请选择文件',
    labelStyle: {
      fontSize: '1.25em',
      fontWeight: '700',
      color: 'black',
      display: 'inline-block',
      fontFamily: 'sans-serif',
      cursor: 'pointer',
    },
    borderStyle: {
      border: '2px solid #979797',
      borderStyle: 'dashed',
      borderRadius: '6px',
      textAlign: 'center',
    },
  };

  state: Readonly<IAvatarEditorState> = {
    imgWidth: 0,
    imgHeight: 0,
    scale: 1,
    image: null,
    file: null,
    containerId: this.generateHash('avatar_container'),
    loaderId: this.generateHash('avatar_loader'),
    lastMouseY: 0,
    showLoader: !(this.props.src || this.props.img),
    cropRadius: this.props.cropRadius,
  };

  get lineWidth() {
    return this.props.lineWidth;
  }

  get containerId() {
    return this.state.containerId;
  }

  get closeIconColor() {
    return this.props.closeIconColor;
  }

  get cropColor() {
    return this.props.cropColor;
  }

  get loaderId() {
    return this.state.loaderId;
  }

  get mimeTypes() {
    return this.props.mimeTypes;
  }

  get backgroundColor() {
    return this.props.backgroundColor;
  }

  get shadingColor() {
    return this.props.shadingColor;
  }

  get shadingOpacity() {
    return this.props.shadingOpacity;
  }

  get mobileScaleSpeed() {
    return this.props.mobileScaleSpeed;
  }

  get cropRadius() {
    return this.state.cropRadius;
  }

  get minCropRadius() {
    return this.props.minCropRadius;
  }

  get scale() {
    return this.state.scale;
  }

  get width() {
    return this.state.imgWidth;
  }

  get halfWidth() {
    return this.state.imgWidth / 2;
  }

  get height() {
    return this.state.imgHeight;
  }

  get halfHeight() {
    return this.state.imgHeight / 2;
  }

  get image() {
    return this.state.image;
  }

  generateHash(prefix: string) {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    return prefix + '-' + s4() + '-' + s4() + '-' + s4();
  }

  onCloseCallback() {
    this.props.onClose();
  }

  onCropCallback(img: string) {
    this.props.onCrop(img);
  }

  onFileLoadCallback(file: File) {
    this.props.onFileLoad(file);
  }

  onBeforeFileLoadCallback(elem: React.ChangeEvent<HTMLInputElement>) {
    this.props.onBeforeFileLoad(elem);
  }

  onImageLoadCallback(image: HTMLImageElement) {
    this.props.onImageLoad(image);
  }

  componentDidMount() {
    if (this.state.showLoader) return;

    const image = this.props.img || new Image();
    if (!this.props.img && this.props.src) {
      image.setAttribute('crossorigin', 'anonymous'); // works for me
      image.src = this.props.src;
    }
    this.setState({ image }, () => {
      if (this.image.complete) return this.init();
      this.image.onload = () => {
        this.onImageLoadCallback(this.image);
        this.init();
      };
    });
  }

  onFileLoad(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();

    this.onBeforeFileLoadCallback(e);
    if (!e.target.value) return;

    let reader = new FileReader();
    let file = e.target.files[0];

    this.onFileLoadCallback(file);

    const image = new Image();
    const ref = this;
    reader.onloadend = () => {
      image.setAttribute('crossorigin', 'anonymous'); // works for me
      image.src = reader.result as string;
      ref.setState({ image, file, showLoader: false }, () => {
        if (ref.image.complete) return ref.init();
        ref.image.onload = () => ref.init();
      });
    };
    reader.readAsDataURL(file);
  }

  onCloseClick = () => {
    this.setState({ showLoader: true }, () => this.onCloseCallback());
  };

  init() {
    const { height, minCropRadius, cropRadius } = this.props;
    const originalWidth = this.image.width;
    const originalHeight = this.image.height;
    const ration = originalHeight / originalWidth;
    const { imageWidth, imageHeight } = this.props;
    let imgHeight: number;
    let imgWidth: number;

    if (imageHeight && imageWidth) {
      throw Error(
        'The imageWidth and imageHeight properties can not be set together, using only imageWidth.'
      );
    }

    if (imageHeight && !imageWidth) {
      imgHeight = imageHeight || originalHeight;
      imgWidth = imgHeight / ration;
    } else if (imageWidth) {
      imgWidth = imageWidth;
      imgHeight = imgWidth * ration || originalHeight;
    } else {
      imgHeight = height || originalHeight;
      imgWidth = imgHeight / ration;
    }

    const scale = imgHeight / originalHeight;
    const calculatedRadius = Math.max(
      minCropRadius,
      cropRadius || Math.min(imgWidth, imgHeight) / 2
    );

    this.setState(
      {
        imgWidth,
        imgHeight,
        scale,
        cropRadius: calculatedRadius,
      },
      this.initCanvas
    );
  }

  initCanvas() {
    const stage = this.initStage();
    const background = this.initBackground();
    const shading = this.initShading();
    const crop = this.initCrop();
    const cropStroke = this.initCropStroke();
    const resize = this.initResize();
    const resizeIcon = this.initResizeIcon();

    const layer = new Konva.Layer();

    layer.add(background);
    layer.add(shading);
    layer.add(cropStroke);
    layer.add(crop);

    layer.add(resize);
    layer.add(resizeIcon);

    stage.add(layer);

    const isLeftCorner = (scale?: number) => crop.x() - scaledRadius(scale) < 0;
    const isTopCorner = (scale?: number) => crop.y() - scaledRadius(scale) < 0;
    const isRightCorner = (scale?: number) =>
      crop.x() + scaledRadius(scale) > stage.width();
    const isBottomCorner = (scale?: number) =>
      crop.y() + scaledRadius(scale) > stage.height();

    const scaledRadius = (scale = 0) => crop.radius() - scale;
    const calcLeft = () => crop.radius() + 1;
    const calcTop = () => crop.radius() + 1;
    const calcRight = () => stage.width() - crop.radius() - 1;
    const calcBottom = () => stage.height() - crop.radius() - 1;
    const isNotOutOfScale = (scale: number) =>
      !isLeftCorner(scale) &&
      !isRightCorner(scale) &&
      !isBottomCorner(scale) &&
      !isTopCorner(scale);
    const calcScaleRadius = (scale: number) =>
      scaledRadius(scale) >= this.minCropRadius
        ? scale
        : crop.radius() - this.minCropRadius;
    const calcResizerX = (x: number) => x + crop.radius() * 0.86;
    const calcResizerY = (y: number) => y - crop.radius() * 0.5;
    const moveResizer = (x: number, y: number) => {
      resize.x(calcResizerX(x) - 8);
      resize.y(calcResizerY(y) - 8);
      resizeIcon.x(calcResizerX(x) - 8);
      resizeIcon.y(calcResizerY(y) - 10);
    };

    const getPreview = () =>
      background.toDataURL({
        x: crop.x() - crop.radius(),
        y: crop.y() - crop.radius(),
        width: crop.radius() * 2,
        height: crop.radius() * 2,
        mimeType: 'image/jpeg',
        quality: 0,
      });

    const onScaleCallback = (scaleY: number, evt: any) => {
      const scale = scaleY > 0 || isNotOutOfScale(scaleY) ? scaleY : 0;
      cropStroke.radius(cropStroke.radius() - calcScaleRadius(scale));
      crop.radius(crop.radius() - calcScaleRadius(scale));
      resize.fire('resize', evt);
    };

    this.onCropCallback(getPreview());

    crop.on('dragmove', evt => crop.fire('resize', evt));
    crop.on('dragend', () => this.onCropCallback(getPreview()));

    crop.on('resize', () => {
      const x = isLeftCorner()
        ? calcLeft()
        : isRightCorner()
        ? calcRight()
        : crop.x();
      const y = isTopCorner()
        ? calcTop()
        : isBottomCorner()
        ? calcBottom()
        : crop.y();
      moveResizer(x, y);
      crop.fillPatternOffset({ x: x / this.scale, y: y / this.scale });
      crop.x(x);
      cropStroke.x(x);
      crop.y(y);
      cropStroke.y(y);
    });

    crop.on('mouseenter', () => (stage.container().style.cursor = 'move'));
    crop.on('mouseleave', () => (stage.container().style.cursor = 'default'));
    crop.on('dragstart', () => (stage.container().style.cursor = 'move'));
    crop.on('dragend', () => (stage.container().style.cursor = 'default'));

    resize.on('touchstart', evt => {
      resize.on('dragmove', dragEvt => {
        if (dragEvt.evt.type !== 'touchmove') return;
        const scaleY =
          dragEvt.evt.changedTouches['0'].pageY -
            evt.evt.changedTouches['0'].pageY || 0;
        onScaleCallback(scaleY * this.mobileScaleSpeed, dragEvt);
      });
    });

    resize.on('dragmove', evt => {
      if (evt.evt.type === 'touchmove') return;
      const newMouseY = evt.evt.y;
      const ieScaleFactor = newMouseY
        ? newMouseY - this.state.lastMouseY
        : undefined;
      const scaleY = evt.evt.movementY || ieScaleFactor || 0;
      this.setState({
        lastMouseY: newMouseY,
      });
      onScaleCallback(scaleY, evt);
    });
    resize.on('dragend', () => this.onCropCallback(getPreview()));

    resize.on('resize', () => moveResizer(crop.x(), crop.y()));

    resize.on(
      'mouseenter',
      () => (stage.container().style.cursor = 'nesw-resize')
    );
    resize.on('mouseleave', () => (stage.container().style.cursor = 'default'));
    resize.on('dragstart', evt => {
      this.setState({
        lastMouseY: evt.evt.y,
      });
      stage.container().style.cursor = 'nesw-resize';
    });
    resize.on('dragend', () => (stage.container().style.cursor = 'default'));
  }

  initStage() {
    return new Konva.Stage({
      container: this.containerId,
      width: this.width,
      height: this.height,
    });
  }

  initBackground() {
    return new Konva.Image({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      image: this.image,
    });
  }

  initShading() {
    return new Konva.Rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      fill: this.shadingColor,
      strokeWidth: 4,
      opacity: this.shadingOpacity,
    });
  }

  initCrop() {
    return new Konva.Circle({
      x: this.halfWidth,
      y: this.halfHeight,
      radius: this.cropRadius,
      fillPatternImage: this.image,
      fillPatternOffset: {
        x: this.halfWidth / this.scale,
        y: this.halfHeight / this.scale,
      },
      fillPatternScale: {
        x: this.scale,
        y: this.scale,
      },
      opacity: 1,
      draggable: true,
      dashEnabled: true,
      dash: [10, 5],
    });
  }

  initCropStroke() {
    return new Konva.Circle({
      x: this.halfWidth,
      y: this.halfHeight,
      radius: this.cropRadius,
      stroke: this.cropColor,
      strokeWidth: this.lineWidth,
      strokeScaleEnabled: true,
      dashEnabled: true,
      dash: [10, 5],
    });
  }

  initResize() {
    return new Konva.Rect({
      x: this.halfWidth + this.cropRadius * 0.86 - 8,
      y: this.halfHeight + this.cropRadius * -0.5 - 8,
      width: 16,
      height: 16,
      draggable: true,
      dragBoundFunc: function(pos) {
        return {
          x: this.getAbsolutePosition().x,
          y: pos.y,
        };
      },
    });
  }

  initResizeIcon() {
    return new Konva.Path({
      x: this.halfWidth + this.cropRadius * 0.86 - 8,
      y: this.halfHeight + this.cropRadius * -0.5 - 10,
      data:
        'M47.624,0.124l12.021,9.73L44.5,24.5l10,10l14.661-15.161l9.963,12.285v-31.5H47.624z M24.5,44.5   L9.847,59.653L0,47.5V79h31.5l-12.153-9.847L34.5,54.5L24.5,44.5z',
      fill: this.cropColor,
      scale: {
        x: 0.2,
        y: 0.2,
      },
    });
  }

  render() {
    const { width, height } = this.props;

    const style: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: this.backgroundColor,
      width: width || this.width,
      position: 'relative',
      borderRadius: '6px',
      overflow: 'hidden',
    };

    const inputStyle: React.CSSProperties = {
      width: 0.1,
      height: 0.1,
      opacity: 0,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: -1,
    };

    const label = this.props.label;

    const labelStyle: React.CSSProperties = {
      ...this.props.labelStyle,
      ...{ lineHeight: (height || 200) + 'px' },
    };

    const borderStyle: React.CSSProperties = {
      ...this.props.borderStyle,
      ...{
        width: width || 200,
        height: height || 200,
      },
    };

    const closeBtnStyle: React.CSSProperties = {
      position: 'absolute',
      zIndex: 999,
      color: this.closeIconColor,
      cursor: 'pointer',
      left: '10px',
      bottom: '10px',
    };

    return (
      <div>
        {this.state.showLoader ? (
          <div style={borderStyle}>
            <input
              onChange={e => this.onFileLoad(e)}
              name={this.loaderId}
              type="file"
              id={this.loaderId}
              style={inputStyle}
              accept={this.mimeTypes}
            />
            <label htmlFor={this.loaderId} style={labelStyle}>
              {label}
            </label>
          </div>
        ) : (
          <div style={style}>
            <span style={closeBtnStyle} onClick={this.onCloseClick}>
              重新选择
            </span>
            <div id={this.containerId} style={{ touchAction: 'none' }} />
          </div>
        )}
      </div>
    );
  }
}

export { AvatarEditor };
