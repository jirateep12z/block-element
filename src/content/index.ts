import { InjectRules } from './injector/css-injector';
import { ActivatePicker, DeactivatePicker } from './picker/element-picker';

type InitializedWindow = Window & { __be_initialized?: boolean };

if (!(window as InitializedWindow).__be_initialized) {
  (window as InitializedWindow).__be_initialized = true;
  void InjectRules();
  chrome.runtime.onMessage.addListener(
    (message: { action: string }, _sender, send_response) => {
      if (message.action === 'activate-picker') {
        ActivatePicker();
        send_response({ success: true });
      } else if (message.action === 'deactivate-picker') {
        DeactivatePicker();
        send_response({ success: true });
      }
      return true;
    }
  );
}
