import { MainScreen } from '../core/ui/screen/MainScreen';
import { SettingScreen } from '../core/ui/screen/SettingScreen';
import { IScreen } from '../core/ui/IScreen';

export const screens: Record<string, () => IScreen> = {
  main: () => new MainScreen(),
  setting: () => new SettingScreen(),
};
