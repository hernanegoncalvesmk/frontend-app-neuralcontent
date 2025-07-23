/**
 * @fileoverview UI Types
 * 
 * Type definitions for UI components, state management, and user interactions.
 * 
 * @version 1.0.0
 * @domain shared
 */

import type { ReactNode, CSSProperties } from 'react';

// ================================
// Component Base Types
// ================================

export interface BaseComponent {
  className?: string;
  style?: CSSProperties;
  id?: string;
  testId?: string;
  children?: ReactNode;
}

export interface InteractiveComponent extends BaseComponent {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// ================================
// Layout Types
// ================================

export interface LayoutProps extends BaseComponent {
  variant?: LayoutVariant;
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  gap?: string | number;
  padding?: string | number;
  margin?: string | number;
}

export enum LayoutVariant {
  CONTAINER = 'container',
  FLEX = 'flex',
  GRID = 'grid',
  STACK = 'stack',
  CLUSTER = 'cluster',
  SIDEBAR = 'sidebar',
}

// ================================
// Form Component Types
// ================================

export interface FormComponentProps extends BaseComponent {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  value?: any;
  defaultValue?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface InputProps extends FormComponentProps {
  type?: InputType;
  autoComplete?: string;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  readOnly?: boolean;
  size?: Size;
  variant?: InputVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
}

export enum InputType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  TEL = 'tel',
  URL = 'url',
  SEARCH = 'search',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime-local',
  MONTH = 'month',
  WEEK = 'week',
  COLOR = 'color',
  RANGE = 'range',
  FILE = 'file',
  HIDDEN = 'hidden',
}

export enum InputVariant {
  OUTLINE = 'outline',
  FILLED = 'filled',
  FLUSHED = 'flushed',
  UNSTYLED = 'unstyled',
}

export enum Size {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

// ================================
// Button Types
// ================================

export interface ButtonProps extends InteractiveComponent {
  variant?: ButtonVariant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  value?: string;
  name?: string;
}

export enum ButtonVariant {
  SOLID = 'solid',
  OUTLINE = 'outline',
  GHOST = 'ghost',
  LINK = 'link',
  UNSTYLED = 'unstyled',
}

// ================================
// Modal and Dialog Types
// ================================

export interface ModalProps extends BaseComponent {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  centered?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  hideCloseButton?: boolean;
  scrollBehavior?: 'inside' | 'outside';
  isCentered?: boolean;
  allowPinchZoom?: boolean;
  preserveScrollBarGap?: boolean;
  returnFocusOnClose?: boolean;
  blockScrollOnMount?: boolean;
}

export enum ModalSize {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  FULL = 'full',
}

// ================================
// Table Types
// ================================

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
  footerRender?: () => ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
}

export interface TableProps<T = any> extends BaseComponent {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  rowKey?: string | ((record: T) => string);
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedRows: string[]) => void;
  sortable?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: string, order: 'asc' | 'desc') => void;
  pagination?: TablePagination;
  onRowClick?: (record: T, index: number) => void;
  rowClassName?: string | ((record: T, index: number) => string);
  expandable?: boolean;
  expandedRowRender?: (record: T, index: number) => ReactNode;
  expandedRowKeys?: string[];
  onExpandedRowsChange?: (expandedRows: string[]) => void;
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: string[];
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

// ================================
// Navigation Types
// ================================

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  active?: boolean;
  children?: NavigationItem[];
  onClick?: () => void;
  permissions?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
  onClick?: () => void;
}

// ================================
// Notification Types
// ================================

export interface NotificationProps {
  id?: string;
  title?: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  actions?: NotificationAction[];
  position?: NotificationPosition;
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LOADING = 'loading',
}

export enum NotificationPosition {
  TOP = 'top',
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM = 'bottom',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
  CENTER = 'center',
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

// ================================
// Loading and Skeleton Types
// ================================

export interface LoadingProps extends BaseComponent {
  size?: Size;
  variant?: LoadingVariant;
  color?: string;
  thickness?: string;
  speed?: string;
  emptyColor?: string;
  trackColor?: string;
  label?: string;
}

export enum LoadingVariant {
  SPINNER = 'spinner',
  DOTS = 'dots',
  PULSE = 'pulse',
  BOUNCE = 'bounce',
  BAR = 'bar',
  RING = 'ring',
}

export interface SkeletonProps extends BaseComponent {
  height?: string | number;
  width?: string | number;
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  lines?: number;
  spacing?: string;
}

export enum SkeletonVariant {
  TEXT = 'text',
  RECT = 'rect',
  CIRCLE = 'circle',
}

export enum SkeletonAnimation {
  PULSE = 'pulse',
  WAVE = 'wave',
  NONE = 'none',
}

// ================================
// Data Display Types
// ================================

export interface CardProps extends BaseComponent {
  variant?: CardVariant;
  size?: Size;
  hover?: boolean;
  clickable?: boolean;
  selected?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  actions?: ReactNode;
}

export enum CardVariant {
  ELEVATED = 'elevated',
  OUTLINED = 'outlined',
  FILLED = 'filled',
  UNSTYLED = 'unstyled',
}

export interface BadgeProps extends BaseComponent {
  variant?: BadgeVariant;
  size?: Size;
  color?: string;
  dot?: boolean;
  count?: number;
  showZero?: boolean;
  max?: number;
  offset?: [number, number];
}

export enum BadgeVariant {
  SOLID = 'solid',
  OUTLINE = 'outline',
  SUBTLE = 'subtle',
}

// ================================
// Menu and Dropdown Types
// ================================

export interface MenuProps extends BaseComponent {
  items: MenuItem[];
  selectedKeys?: string[];
  openKeys?: string[];
  onSelect?: (selectedKeys: string[]) => void;
  onOpenChange?: (openKeys: string[]) => void;
  mode?: MenuMode;
  theme?: MenuTheme;
  collapsible?: boolean;
  collapsed?: boolean;
  inlineIndent?: number;
}

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItem[];
  type?: MenuItemType;
  onClick?: () => void;
}

export enum MenuMode {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  INLINE = 'inline',
}

export enum MenuTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum MenuItemType {
  ITEM = 'item',
  GROUP = 'group',
  DIVIDER = 'divider',
  SUBMENU = 'submenu',
}

// ================================
// State Management Types
// ================================

export interface UIState {
  theme: ThemeState;
  layout: LayoutState;
  modals: ModalState;
  notifications: NotificationState;
  loading: LoadingState;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  colorScheme: string;
  customTheme?: Record<string, any>;
}

export interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  headerHeight: number;
  footerHeight: number;
  breakpoint: string;
  isMobile: boolean;
}

export interface ModalState {
  openModals: string[];
  modalData: Record<string, any>;
}

export interface NotificationState {
  notifications: NotificationProps[];
  position: NotificationPosition;
  maxCount: number;
}

export interface LoadingState {
  global: boolean;
  requests: Record<string, boolean>;
  components: Record<string, boolean>;
}
