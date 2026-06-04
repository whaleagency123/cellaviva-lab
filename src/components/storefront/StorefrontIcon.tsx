import {
  Shield, RefreshCw, Headphones, HelpCircle, ShoppingBag,
  Star, Heart, Zap, CheckCircle, Award, Truck, Gift,
  Leaf, Droplets, Sun, Moon, Sparkles, FlameKindling,
  Package, Lock, ThumbsUp, Smile, Globe, Phone, Mail,
  Clock, ArrowRight, ChevronRight, Info, AlertCircle,
} from 'lucide-react'

export const ICON_REGISTRY: Record<string, React.ElementType> = {
  Shield, RefreshCw, Headphones, HelpCircle, ShoppingBag,
  Star, Heart, Zap, CheckCircle, Award, Truck, Gift,
  Leaf, Droplets, Sun, Moon, Sparkles, FlameKindling,
  Package, Lock, ThumbsUp, Smile, Globe, Phone, Mail,
  Clock, ArrowRight, ChevronRight, Info, AlertCircle,
}

export const ICON_OPTIONS: { name: string; label: string }[] = [
  { name: 'Shield',       label: 'Shield' },
  { name: 'RefreshCw',    label: 'Refresh' },
  { name: 'Headphones',   label: 'Headphones' },
  { name: 'HelpCircle',   label: 'Help' },
  { name: 'ShoppingBag',  label: 'Shopping Bag' },
  { name: 'Star',         label: 'Star' },
  { name: 'Heart',        label: 'Heart' },
  { name: 'Zap',          label: 'Zap' },
  { name: 'CheckCircle',  label: 'Check Circle' },
  { name: 'Award',        label: 'Award' },
  { name: 'Truck',        label: 'Truck' },
  { name: 'Gift',         label: 'Gift' },
  { name: 'Leaf',         label: 'Leaf' },
  { name: 'Droplets',     label: 'Droplets' },
  { name: 'Sun',          label: 'Sun' },
  { name: 'Moon',         label: 'Moon' },
  { name: 'Sparkles',     label: 'Sparkles' },
  { name: 'FlameKindling',label: 'Flame' },
  { name: 'Package',      label: 'Package' },
  { name: 'Lock',         label: 'Lock' },
  { name: 'ThumbsUp',     label: 'Thumbs Up' },
  { name: 'Smile',        label: 'Smile' },
  { name: 'Globe',        label: 'Globe' },
  { name: 'Phone',        label: 'Phone' },
  { name: 'Mail',         label: 'Mail' },
  { name: 'Clock',        label: 'Clock' },
  { name: 'ArrowRight',   label: 'Arrow Right' },
  { name: 'ChevronRight', label: 'Chevron Right' },
  { name: 'Info',         label: 'Info' },
  { name: 'AlertCircle',  label: 'Alert' },
]

interface StorefrontIconProps {
  name: string
  className?: string
  style?: React.CSSProperties
}

export function StorefrontIcon({ name, className, style }: StorefrontIconProps) {
  const Icon = ICON_REGISTRY[name] ?? Shield
  return <Icon className={className} style={style} />
}
