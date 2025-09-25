import { NodeConfig } from '../types';

export const nodeConfigs: NodeConfig[] = [
  {
    id: 'blank',
    label: 'New Page',
    type: 'main',
    description: 'This is a blank page with no predefined UI elements.',
    uiOptions: [
      {
        label: 'Custom Content',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Add your custom content here'
      },
    ]
  },
  {
    id: 'login',
    label: 'Login',
    type: 'auth',
    description: 'User authentication page with username and password fields',
    uiOptions: [
      {
        label: 'Username Field',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true, minLength: 3 },
        uiText: 'Enter your username',
        value: ''
      },
      {
        label: 'Password Field',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true, minLength: 6 },
        uiText: 'Enter your password',
        value: ''
      },
      {
        label: 'Remember Me',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Remember me',
        value: false
      },
      {
        label: 'Login Button',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Sign In'
      }
    ]
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    type: 'main',
    description: 'Main dashboard with overview and navigation options',
    uiOptions: [
      {
        label: 'Welcome Message',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Welcome to your dashboard'
      },
      {
        label: 'Quick Stats',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Statistics and metrics display'
      },
      {
        label: 'Navigation Menu',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Main navigation options'
      }
    ]
  },
  {
    id: 'profile',
    label: 'Profile',
    type: 'user',
    description: 'User profile management page',
    uiOptions: [
      {
        label: 'First Name',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true },
        uiText: 'Enter first name',
        value: ''
      },
      {
        label: 'Last Name',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true },
        uiText: 'Enter last name',
        value: ''
      },
      {
        label: 'Email',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
        uiText: 'Enter email address',
        value: ''
      },
      {
        label: 'Save Changes',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Save Profile'
      }
    ]
  },
  {
    id: 'fileview',
    label: 'File View',
    type: 'content',
    description: 'File viewing and management interface',
    uiOptions: [
      {
        label: 'File Name',
        inputType: 'Div',
        isVisible: true,
        uiText: 'document.pdf'
      },
      {
        label: 'File Content',
        inputType: 'Div',
        isVisible: true,
        uiText: 'File content preview area'
      },
      {
        label: 'Download',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Download File'
      }
    ]
  },
  {
    id: 'list',
    label: 'List',
    type: 'content',
    description: 'List view for displaying items',
    uiOptions: [
      {
        label: 'List Title',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Item List'
      },
      {
        label: 'Show Headers',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Show list headers',
        value: true
      },
      {
        label: 'Items Per Page',
        inputType: 'Textbox',
        isVisible: true,
        validation: { pattern: '^[0-9]+$' },
        uiText: 'Items per page',
        value: '10'
      }
    ]
  },
  {
    id: 'table',
    label: 'Table',
    type: 'content',
    description: 'Data table with sorting and filtering capabilities',
    uiOptions: [
      {
        label: 'Table Title',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Data Table'
      },
      {
        label: 'Enable Sorting',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Enable column sorting',
        value: true
      },
      {
        label: 'Enable Filtering',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Enable data filtering',
        value: true
      },
      {
        label: 'Export Data',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Export to CSV'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    type: 'config',
    description: 'Application settings and preferences',
    uiOptions: [
      {
        label: 'Theme Mode',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Dark mode',
        value: false
      },
      {
        label: 'Language',
        inputType: 'Textbox',
        isVisible: true,
        uiText: 'Select language',
        value: 'English'
      },
      {
        label: 'Notifications',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Enable notifications',
        value: true
      },
      {
        label: 'Save Settings',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Save Changes'
      }
    ]
  },
  {
    id: 'createaccount',
    label: 'Create Account',
    type: 'auth',
    description: 'New user registration form',
    uiOptions: [
      {
        label: 'Username',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true, minLength: 3 },
        uiText: 'Choose a username',
        value: ''
      },
      {
        label: 'Email',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true, pattern: '^[^@]+@[^@]+\\.[^@]+$' },
        uiText: 'Enter email address',
        value: ''
      },
      {
        label: 'Password',
        inputType: 'Textbox',
        isVisible: true,
        validation: { required: true, minLength: 8 },
        uiText: 'Create password',
        value: ''
      },
      {
        label: 'Terms Agreement',
        inputType: 'Checkbox',
        isVisible: true,
        validation: { required: true },
        uiText: 'I agree to terms and conditions',
        value: false
      },
      {
        label: 'Create Account',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Sign Up'
      }
    ]
  },
  {
    id: 'messagewindow',
    label: 'Message Window',
    type: 'communication',
    description: 'Chat or messaging interface',
    uiOptions: [
      {
        label: 'Messages Area',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Message conversation area'
      },
      {
        label: 'Message Input',
        inputType: 'Textbox',
        isVisible: true,
        validation: { maxLength: 500 },
        uiText: 'Type your message...',
        value: ''
      },
      {
        label: 'Send Message',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Send'
      }
    ]
  },
  {
    id: 'errorpage',
    label: 'Error Page',
    type: 'system',
    description: 'Error handling and display page',
    uiOptions: [
      {
        label: 'Error Title',
        inputType: 'Div',
        isVisible: true,
        uiText: 'Oops! Something went wrong'
      },
      {
        label: 'Error Message',
        inputType: 'Div',
        isVisible: true,
        uiText: 'We encountered an unexpected error. Please try again.'
      },
      {
        label: 'Show Details',
        inputType: 'Checkbox',
        isVisible: true,
        uiText: 'Show error details',
        value: false
      },
      {
        label: 'Go Back',
        inputType: 'Button',
        isVisible: true,
        uiText: 'Return to Home'
      }
    ]
  }
];

export const getNodeConfigById = (id: string): NodeConfig | undefined => {
  return nodeConfigs.find(config => config.id === id);
};

export const getNodeConfigsByType = (type: string): NodeConfig[] => {
  return nodeConfigs.filter(config => config.type === type);
};

export const getAllNodeTypes = (): string[] => {
  const typeSet = new Set(nodeConfigs.map(config => config.type));
  return Array.from(typeSet);
};