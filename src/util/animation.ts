import gsap from 'gsap';

export const wiggle = async (element: { x: number }) => {
  const originalX = element.x;
  await gsap.to(element, { x: '-=4', duration: 0.01 });
  await gsap.to(element, { x: '+=8', duration: 0.025, yoyo: true, repeat: 4 });
  await gsap.to(element, { x: originalX, duration: 0.1 });
};
