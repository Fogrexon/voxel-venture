import { MainScreen } from './ui/screen/MainScreen';
import { SettingScreen } from './ui/screen/SettingScreen';
import { IScreen } from '../core/ui/IScreen';

export const screens: Record<string, () => IScreen> = {
  main: () => new MainScreen(),
  setting: () => new SettingScreen(),
};
