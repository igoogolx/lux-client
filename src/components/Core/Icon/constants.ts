import MonitorIcon from "@fortawesome/fontawesome-free/svgs/brands/watchman-monitoring.svg";
import CloseCircleIcon from "@fortawesome/fontawesome-free/svgs/regular/circle-xmark.svg";
import DownIcon from "@fortawesome/fontawesome-free/svgs/solid/angle-down.svg";
import UpIcon from "@fortawesome/fontawesome-free/svgs/solid/angle-up.svg";
import ArrowDownIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-down.svg";
import ArrowUpIcon from "@fortawesome/fontawesome-free/svgs/solid/arrow-up.svg";
import FlashIcon from "@fortawesome/fontawesome-free/svgs/solid/bolt.svg";
import NoteIcon from "@fortawesome/fontawesome-free/svgs/solid/book.svg";
import CheckCircleIcon from "@fortawesome/fontawesome-free/svgs/solid/circle-check.svg";
import WarningCircleIcon from "@fortawesome/fontawesome-free/svgs/solid/circle-exclamation.svg";
import InfoCircleIcon from "@fortawesome/fontawesome-free/svgs/solid/circle-info.svg";
import SpinIcon from "@fortawesome/fontawesome-free/svgs/solid/circle-notch.svg";
import QuestionIcon from "@fortawesome/fontawesome-free/svgs/solid/circle-question.svg";
import CloseCircleFillIcon from "@fortawesome/fontawesome-free/svgs/solid/circle-xmark.svg";
import CopyIcon from "@fortawesome/fontawesome-free/svgs/solid/copy.svg";
import EllipsisIcon from "@fortawesome/fontawesome-free/svgs/solid/ellipsis.svg";
import EyeCloseIcon from "@fortawesome/fontawesome-free/svgs/solid/eye-slash.svg";
import EyeIcon from "@fortawesome/fontawesome-free/svgs/solid/eye.svg";
import DashboardIcon from "@fortawesome/fontawesome-free/svgs/solid/gauge.svg";
import SettingIcon from "@fortawesome/fontawesome-free/svgs/solid/gear.svg";
import HomeIcon from "@fortawesome/fontawesome-free/svgs/solid/house.svg";
import SearchIcon from "@fortawesome/fontawesome-free/svgs/solid/magnifying-glass.svg";
import MoonIcon from "@fortawesome/fontawesome-free/svgs/solid/moon.svg";
import PlaneIcon from "@fortawesome/fontawesome-free/svgs/solid/paper-plane.svg";
import EditIcon from "@fortawesome/fontawesome-free/svgs/solid/pen-to-square.svg";
import PlusIcon from "@fortawesome/fontawesome-free/svgs/solid/plus.svg";
import QrCodeIcon from "@fortawesome/fontawesome-free/svgs/solid/qrcode.svg";
import SwapIcon from "@fortawesome/fontawesome-free/svgs/solid/right-left.svg";
import SyncIcon from "@fortawesome/fontawesome-free/svgs/solid/rotate.svg";
import DatabaseIcon from "@fortawesome/fontawesome-free/svgs/solid/server.svg";
import LoadingIcon from "@fortawesome/fontawesome-free/svgs/solid/spinner.svg";
import SunIcon from "@fortawesome/fontawesome-free/svgs/solid/sun.svg";
import TrashIcon from "@fortawesome/fontawesome-free/svgs/solid/trash-can.svg";
import ToTopIcon from "@fortawesome/fontawesome-free/svgs/solid/up-long.svg";
import CloseIcon from "@fortawesome/fontawesome-free/svgs/solid/xmark.svg";
import LogoIcon from "../../../../public/logo.svg";

export enum IconNameEnum {
  Home,
  ArrowDown,
  ArrowUp,
  Flash,
  Plane,
  Database,
  ToTop,
  Ellipsis,
  EyeClose,
  Eye,
  Close,
  Up,
  Down,
  Plus,
  Dashboard,
  Loading,
  Monitor,
  Note,
  CloseCircle,
  CloseCircleFill,
  Trash,
  Edit,
  Swap,
  Copy,
  Logo,
  CheckCircle,
  InfoCircle,
  WarningCircle,
  Setting,
  QrCode,
  Spin,
  Sync,
  Question,
  Sun,
  Moon,
  Search,
}

export const IconMap = {
  [IconNameEnum.Home]: HomeIcon,
  [IconNameEnum.ArrowUp]: ArrowUpIcon,
  [IconNameEnum.ArrowDown]: ArrowDownIcon,
  [IconNameEnum.Flash]: FlashIcon,
  [IconNameEnum.Plane]: PlaneIcon,
  [IconNameEnum.Database]: DatabaseIcon,
  [IconNameEnum.ToTop]: ToTopIcon,
  [IconNameEnum.Ellipsis]: EllipsisIcon,
  [IconNameEnum.EyeClose]: EyeCloseIcon,
  [IconNameEnum.Eye]: EyeIcon,
  [IconNameEnum.Close]: CloseIcon,
  [IconNameEnum.Up]: UpIcon,
  [IconNameEnum.Down]: DownIcon,
  [IconNameEnum.Plus]: PlusIcon,
  [IconNameEnum.Dashboard]: DashboardIcon,
  [IconNameEnum.Loading]: LoadingIcon,
  [IconNameEnum.Monitor]: MonitorIcon,
  [IconNameEnum.Note]: NoteIcon,
  [IconNameEnum.CloseCircle]: CloseCircleIcon,
  [IconNameEnum.CloseCircleFill]: CloseCircleFillIcon,
  [IconNameEnum.Trash]: TrashIcon,
  [IconNameEnum.Edit]: EditIcon,
  [IconNameEnum.Swap]: SwapIcon,
  [IconNameEnum.Copy]: CopyIcon,
  [IconNameEnum.Logo]: LogoIcon,
  [IconNameEnum.CheckCircle]: CheckCircleIcon,
  [IconNameEnum.InfoCircle]: InfoCircleIcon,
  [IconNameEnum.WarningCircle]: WarningCircleIcon,
  [IconNameEnum.Setting]: SettingIcon,
  [IconNameEnum.QrCode]: QrCodeIcon,
  [IconNameEnum.Spin]: SpinIcon,
  [IconNameEnum.Sync]: SyncIcon,
  [IconNameEnum.Question]: QuestionIcon,
  [IconNameEnum.Sun]: SunIcon,
  [IconNameEnum.Moon]: MoonIcon,
  [IconNameEnum.Search]: SearchIcon,
};
