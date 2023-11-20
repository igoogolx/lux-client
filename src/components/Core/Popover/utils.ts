import { type CSSProperties, useEffect, useRef } from 'react'
import { type PopoverProps } from './type'
import { BASE_PLACEMENT, VARIATION_PLACEMENT } from './constants'

const defaultArrowWidth = 8
const arrowDistance = 5

export const computeDistance = (withArrow: boolean, distance: number) =>
  withArrow ? distance + arrowDistance : distance

const getReferenceRect = (
  originalReferenceRect: DOMRect,
  containerRect: DOMRect
) => {
  return {
    top: originalReferenceRect.top - containerRect.top,
    bottom: originalReferenceRect.bottom - containerRect.top,
    left: originalReferenceRect.left - containerRect.left,
    right: originalReferenceRect.right - containerRect.left,
    width: originalReferenceRect.width,
    height: originalReferenceRect.height
  }
}

const getBasePlacement = (placement: string) => placement.split('-')[0]
const getVariationPlacement = (placement: string) => placement.split('-')[1]

export const computeStyle = (
  containerRect: DOMRect,
  originalReferenceRect: DOMRect,
  popperRect: DOMRect,
  placement: string,
  {
    distance,
    withArrow,
    arrowBorderColor,
    arrowWidth,
    skidding
  }: {
    distance: number
    withArrow: boolean
    arrowBorderColor?: string
    arrowWidth?: number
    skidding: number
  }
) => {
  const referenceRect = getReferenceRect(originalReferenceRect, containerRect)
  const basePlacement = getBasePlacement(placement)
  const { top, bottom, left, right } = BASE_PLACEMENT
  const { start, end } = VARIATION_PLACEMENT
  const computedDistance = computeDistance(withArrow, distance)
  const arrowSideLength = arrowWidth || defaultArrowWidth
  const computedArrowHeight = arrowSideLength / 2
  let arrowStyle: CSSProperties = {}
  const popperStyle: CSSProperties & { top?: number, left?: number } = {}

  switch (placement) {
    case `${left}-${start}`:
      popperStyle.top = referenceRect.top + skidding
      break
    case `${left}-${end}`:
      popperStyle.top = referenceRect.bottom - popperRect.height + skidding
      break
    case left:
      popperStyle.top =
        referenceRect.top +
        (referenceRect.height - popperRect.height) / 2 +
        skidding
      break
    case `${right}-${start}`:
      popperStyle.top = referenceRect.top + skidding
      break
    case `${right}-${end}`:
      popperStyle.top = referenceRect.bottom - popperRect.height + skidding
      break
    case right:
      popperStyle.top =
        referenceRect.top +
        (referenceRect.height - popperRect.height) / 2 +
        skidding
      break
    case `${top}-${start}`:
      popperStyle.left = referenceRect.left + skidding
      break
    case `${top}-${end}`:
      popperStyle.left = referenceRect.right - popperRect.width + skidding
      break
    case top:
      popperStyle.left =
        referenceRect.left +
        (referenceRect.width - popperRect.width) / 2 +
        skidding
      break
    case `${bottom}-${start}`:
      popperStyle.left = referenceRect.left + skidding
      break
    case `${bottom}-${end}`:
      popperStyle.left = referenceRect.right - popperRect.width + skidding
      break
    case bottom:
      popperStyle.left =
        referenceRect.left +
        (referenceRect.width - popperRect.width) / 2 +
        skidding
      break
    default: {
      throw new Error(`invalid popover placement: ${placement}`)
    }
  }
  switch (basePlacement) {
    case left:
      popperStyle.left =
        referenceRect.left - computedDistance - popperRect.width
      if (withArrow) {
        arrowStyle = {
          right: -computedArrowHeight,
          borderColor: `${arrowBorderColor} ${arrowBorderColor} transparent transparent`,
          top: Math.abs(
            referenceRect.top +
              referenceRect.height / 2 -
              (popperStyle.top as number) -
              arrowSideLength / 2
          )
        }
      }
      break
    case right:
      popperStyle.left = referenceRect.right + computedDistance
      if (withArrow) {
        arrowStyle = {
          left: -computedArrowHeight,
          borderColor: `transparent transparent ${arrowBorderColor} ${arrowBorderColor}`,
          top: Math.abs(
            referenceRect.top +
              referenceRect.height / 2 -
              (popperStyle.top as number) -
              arrowSideLength / 2
          )
        }
      }
      break
    case top:
      popperStyle.top =
        referenceRect.top - popperRect.height - computedDistance
      if (withArrow) {
        arrowStyle = {
          bottom: -computedArrowHeight,
          borderColor: `transparent ${arrowBorderColor} ${arrowBorderColor} transparent`,
          left: Math.abs(
            referenceRect.left +
              referenceRect.width / 2 -
              (popperStyle.left as number) -
              arrowSideLength / 2
          )
        }
      }
      break
    case bottom:
      popperStyle.top = referenceRect.bottom + computedDistance
      if (withArrow) {
        arrowStyle = {
          top: -computedArrowHeight,
          borderColor: `${arrowBorderColor} transparent transparent ${arrowBorderColor}`,
          left: Math.abs(
            referenceRect.left +
              referenceRect.width / 2 -
              (popperStyle.left as number) -
              arrowSideLength / 2
          )
        }
      }
      break
    default: {
      throw new Error(`invalid popover placement: ${placement}`)
    }
  }
  if (withArrow) {
    arrowStyle = {
      ...arrowStyle,
      width: arrowSideLength,
      height: arrowSideLength
    }
  }

  return {
    popper: popperStyle,
    arrow: arrowStyle
  }
}

export const preventOverflow = (
  popperRect: DOMRect,
  originalReferenceRect: DOMRect,
  containerRect: DOMRect,
  placement: NonNullable<PopoverProps['placement']>,
  option: { distance: number, withArrow: boolean, skidding: number }
) => {
  const referenceRect = getReferenceRect(originalReferenceRect, containerRect)
  let basePlacement = getBasePlacement(placement)
  let variationPlacement = getVariationPlacement(placement)
  const { withArrow, distance, skidding } = option
  const computedDistance = computeDistance(withArrow, distance)
  const { height: clientHeight, width: clientWidth } = containerRect
  const baseOffset = {
    x: referenceRect.left + referenceRect.width / 2,
    y: referenceRect.top + referenceRect.height / 2
  }
  const { top, bottom, left, right } = BASE_PLACEMENT
  const { start, end } = VARIATION_PLACEMENT

  let baseVariationPositionType: 'x' | 'y' = 'x'
  let baseVariationLengthType: 'width' | 'height' = 'width'

  switch (basePlacement) {
    case top:
      baseVariationPositionType = 'x'
      baseVariationLengthType = 'width'
      if (referenceRect.top < popperRect.height + computedDistance) {
        basePlacement = bottom
      }
      break
    case bottom:
      baseVariationPositionType = 'x'
      baseVariationLengthType = 'width'
      if (
        clientHeight - referenceRect.bottom <
        popperRect.height + computedDistance
      ) {
        basePlacement = top
      }
      break
    case left:
      baseVariationPositionType = 'y'
      baseVariationLengthType = 'height'
      if (referenceRect.left < popperRect.width + computedDistance) {
        basePlacement = right
      }
      break
    case right:
      baseVariationPositionType = 'y'
      baseVariationLengthType = 'height'
      if (
        clientWidth - referenceRect.right <
        popperRect.width + computedDistance
      ) {
        basePlacement = left
      }
      break
    default: {
      throw new Error(`invalid popover placement: ${placement}`)
    }
  }

  if (!variationPlacement) {
    if (
      baseOffset[baseVariationPositionType] <
      popperRect[baseVariationLengthType] / 2 - skidding
    ) {
      variationPlacement = start
    }
    if (
      baseOffset[baseVariationPositionType] +
        popperRect[baseVariationLengthType] / 2 +
        skidding >
      (baseVariationLengthType === 'width' ? clientWidth : clientHeight)
    ) {
      variationPlacement = end
    }
  } else if (variationPlacement === start) {
    if (
      baseOffset[baseVariationPositionType] -
        referenceRect[baseVariationLengthType] / 2 +
        popperRect[baseVariationLengthType] +
        skidding >
      (baseVariationLengthType === 'width' ? clientWidth : clientHeight)
    ) {
      variationPlacement = end
    }
  } else if (variationPlacement === end) {
    if (
      baseOffset[baseVariationPositionType] +
        referenceRect[baseVariationLengthType] / 2 -
        skidding <
      popperRect[baseVariationLengthType]
    ) {
      variationPlacement = start
    }
  }
  return variationPlacement
    ? `${basePlacement}-${variationPlacement}`
    : basePlacement
}

export const useMemoObj = <T>(obj: T) => {
  const previousObj = useRef(obj)
  useEffect(() => {
    if (JSON.stringify(obj) !== JSON.stringify(previousObj.current)) {
      previousObj.current = obj
    }
  }, [obj])
  return previousObj.current
}
