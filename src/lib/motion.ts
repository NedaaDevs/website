import { animate } from 'motion/mini';
import { inView } from 'motion';

export type RiseOpts = { delay?: number; y?: number; duration?: number };

export const riseIn = (el: Element, { delay = 0, y = 12, duration = 0.5 }: RiseOpts = {}) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Object.assign((el as HTMLElement).style, { opacity: '1', transform: 'none' });
    return () => {};
  }
  return inView(
    el,
    () => {
      animate(
        el,
        { opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0)'] },
        { duration, delay, ease: [0.22, 1, 0.36, 1] },
      );
    },
    { margin: '0px 0px -10% 0px' },
  );
};

export const autoRise = (root: ParentNode = document) => {
  for (const el of root.querySelectorAll<HTMLElement>('.fx-rise')) riseIn(el);
};
