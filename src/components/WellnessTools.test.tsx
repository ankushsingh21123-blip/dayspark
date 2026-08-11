import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WellnessTools } from './WellnessTools';

test('offers a Pomodoro and native guided meditation in one compact tool', async () => {
  const speak = vi.fn();
  vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} });
  vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn() });
  render(<WellnessTools />);

  expect(screen.getByText('25:00')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Meditate' }));
  await userEvent.click(screen.getByRole('button', { name: 'Productivity' }));
  await userEvent.click(screen.getByRole('button', { name: 'Begin meditation' }));

  expect(speak).toHaveBeenCalledOnce();
  expect(screen.getByText('03:00')).toBeVisible();
  vi.unstubAllGlobals();
});
