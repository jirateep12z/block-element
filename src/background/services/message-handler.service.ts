import type { BackgroundMessage } from '@/types';
import {
  DeleteRule,
  GetAllRules,
  GetRules,
  GetSettings,
  GetStatistics,
  ImportRules,
  SaveRule,
  SaveSettings,
  ToggleRule,
  UpdateStatistics
} from './rules.service';
import { AddToWhitelist, RemoveFromWhitelist } from './whitelist.service';

export function HandleMessage(
  message: BackgroundMessage,
  _sender: chrome.runtime.MessageSender,
  send_response: (response?: unknown) => void
): boolean {
  const HandleAsync = async () => {
    try {
      switch (message.action) {
        case 'get-settings':
          send_response(await GetSettings());
          break;
        case 'save-settings':
          await SaveSettings(message.settings);
          send_response({ success: true });
          break;
        case 'get-rules':
          send_response(await GetRules(message.domain));
          break;
        case 'get-all-rules':
          send_response(await GetAllRules());
          break;
        case 'save-rule': {
          const saved_rule = await SaveRule(message.rule);
          await UpdateStatistics();
          send_response(saved_rule);
          break;
        }
        case 'delete-rule':
          await DeleteRule(message.rule_id, message.domain);
          await UpdateStatistics();
          send_response({ success: true });
          break;
        case 'toggle-rule':
          await ToggleRule(message.rule_id, message.domain, message.is_enabled);
          send_response({ success: true });
          break;
        case 'import-rules': {
          const result = await ImportRules(message.rules);
          await UpdateStatistics();
          send_response(result);
          break;
        }
        case 'get-statistics':
          send_response(await GetStatistics());
          break;
        case 'add-to-whitelist':
          await AddToWhitelist(message.domain);
          send_response({ success: true });
          break;
        case 'remove-from-whitelist':
          await RemoveFromWhitelist(message.domain);
          send_response({ success: true });
          break;
        default:
          send_response({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Message handler error:', error);
      send_response({ error: (error as Error).message });
    }
  };
  void HandleAsync();
  return true;
}
