import { MainScreen } from '../core/ui/screen/MainScreen';
import { SettingScreen } from '../core/ui/screen/SettingScreen';
import { IScreen } from '../core/ui/IScreen';
import { MapSelectionScreen } from '../core/ui/screen/MapSelectionScreen';
import { OfficeSelectScreen } from '../core/ui/screen/OfficeSelectScreen';

export const screens: Record<string, () => IScreen> = {
  main: () => new MainScreen(),
  setting: () => new SettingScreen(),
  mapSelection: () => new MapSelectionScreen(),
  officeSelect: () => new OfficeSelectScreen(),
};
