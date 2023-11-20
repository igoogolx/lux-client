import * as React from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import debounce from '../../../utils/debouce'
import styles from './index.module.css'
import { computeStyle, preventOverflow, useMemoObj } from './utils'
import { PlacementEnum, type PopoverProps, TriggerEnum } from './type'

export const Popover = React.memo((props: PopoverProps) => {
  const {
    content,
    children,
    defaultOpen = false,
    placement = PlacementEnum.Top,
    withArrow = false,
    distance = 5,
    skidding = 0,
    trigger = TriggerEnum.Hover,
    popoverStyle = {},
    arrowStyle = {},
    popoverClassName = '',
    arrowClassName = '',
    className = '',
    skiddingOption,
    distanceOption,
    withState = true,
    isOpen: customizedIsOpen = false,
    setIsOpen: customizedSetIsOpen,
    timeout = 0,
    disabled = false,
    getContainerElement
  } = props

  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  )
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [computedStyle, setComputedStyle] = useState<{
    popper: React.CSSProperties
    arrow: React.CSSProperties
  }>({
    popper: { left: 0, top: 0 },
    arrow: {}
  })
  const computedIsOpen = withState ? isOpen : customizedIsOpen
  const computedSetIsOpen = withState ? setIsOpen : customizedSetIsOpen
  const memoSkiddingOption = useMemoObj(skiddingOption)
  const memoDistanceOption = useMemoObj(distanceOption)

  const containerElement = getContainerElement
    ? getContainerElement()
    : document.body

  const changeStyle = useCallback(() => {
    if (
      !computedIsOpen ||
      !referenceElement ||
      !popperElement ||
      !containerElement
    ) {
      return
    }
    const referenceRect = referenceElement.getBoundingClientRect()
    const popperRect = popperElement.getBoundingClientRect()
    const containerRect = containerElement.getBoundingClientRect()
    const computedPlacement = preventOverflow(
      popperRect,
      referenceRect,
      containerRect,
      placement,
      {
        withArrow,
        distance:
          (memoDistanceOption?.[placement]) || distance,
        skidding:
          (memoSkiddingOption?.[placement]) || skidding
      }
    ) as PlacementEnum
    setComputedStyle(
      computeStyle(
        containerRect,
        referenceRect,
        popperRect,
        computedPlacement,
        {
          distance:
            (memoDistanceOption?.[computedPlacement]) ||
            distance,
          skidding:
            (memoSkiddingOption?.[computedPlacement]) ||
            skidding,
          withArrow,
          arrowBorderColor: arrowStyle.borderColor,
          arrowWidth: arrowStyle.width as number
        }
      )
    )
  }, [
    computedIsOpen,
    referenceElement,
    popperElement,
    containerElement,
    placement,
    withArrow,
    memoDistanceOption,
    distance,
    memoSkiddingOption,
    skidding,
    arrowStyle.borderColor,
    arrowStyle.width
  ])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resizeListener = useCallback(debounce(changeStyle, 200), [changeStyle])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const open = useCallback(() => {
    if (timeout) {
      timer.current = setTimeout(() => {
        computedSetIsOpen?.(true)
      }, timeout)
    } else {
      computedSetIsOpen?.(true)
    }
  }, [computedSetIsOpen, timeout])
  const close = useCallback(() => {
    if (timeout && timer.current) {
      clearTimeout(timer.current)
    }
    computedSetIsOpen?.(false)
  }, [computedSetIsOpen, timeout])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!computedIsOpen) return
      if (
        !event.target ||
        !popperElement ||
        !referenceElement ||
        popperElement.contains(event.target as Node) ||
        referenceElement.contains(event.target as Node)
      ) {
        return
      }
      close()
    },
    [close, computedIsOpen, popperElement, referenceElement]
  )

  useEffect(() => {
    if (trigger === 'click') {
      document.addEventListener('click', handleClickOutside)
    }
    return () => {
      if (trigger === 'click') {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [handleClickOutside, trigger])

  useEffect(() => {
    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [resizeListener])

  useLayoutEffect(() => {
    changeStyle()
  }, [changeStyle])

  let popperElementStyle = popoverStyle
  let arrowElementStyle = arrowStyle
  if (computedStyle.popper) {
    popperElementStyle = { ...computedStyle.popper, ...popperElementStyle }
  }
  if (computedStyle.arrow) {
    arrowElementStyle = { ...computedStyle.arrow, ...arrowElementStyle }
    if (computedStyle.arrow.borderColor) {
      arrowElementStyle = {
        ...arrowElementStyle,
        borderColor: computedStyle.arrow.borderColor
      }
    }
  }

  const popover = (
    <div
      style={popperElementStyle}
      className={classNames(styles.popover, popoverClassName)}
      ref={setPopperElement}
    >
      {withArrow && (
        <div
          className={classNames(styles.arrow, arrowClassName)}
          style={arrowElementStyle}
        />
      )}
      {
        (typeof content === 'function' && withState
          ? content({ open, close, isOpen })
          : content) as React.ReactNode
      }
    </div>
  )

  const getEvents = () => {
    if (trigger === TriggerEnum.Click) {
      return {
        onClick: () => {
          if (computedIsOpen) close()
          else open()
        }
      }
    }
    if (trigger === TriggerEnum.Hover) {
      return {
        onMouseEnter: open,
        onMouseLeave: close
      }
    }
    return {}
  }

  return (
    <>
      <div ref={setReferenceElement} {...getEvents()} className={className}>
        {
          (typeof children === 'function' && withState
            ? children({ open, close, isOpen })
            : children) as React.ReactNode
        }
      </div>
      {!disabled && computedIsOpen && createPortal(popover, containerElement)}
    </>
  )
})

export * from './type'

export default Popover
