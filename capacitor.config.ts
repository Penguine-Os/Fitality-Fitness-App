import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'be.fitality.ionic',
  appName: 'Fitality',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Haptics:{
      enabled: true
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com','github.com'],
    },
  }
};

export default config;
