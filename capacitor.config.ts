import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'be.fitality.ionic',
  appName: 'Fitality',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    capacitorHttp: {
      enabled: true,
    },
    firebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com','github.com'],
    },
  }
};

export default config;
