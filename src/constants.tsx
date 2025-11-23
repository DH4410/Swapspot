import { Difficulty, DifficultyConfig } from './types';
import { 
  Zap, Anchor, Aperture, Archive, Asterisk, Award, 
  Banana, Beaker, Bell, Binary, Bird, Bitcoin, 
  Bluetooth, Bomb, Bone, Box, Briefcase, Bug, 
  Camera, Candy, Car, Carrot, Cast, Cat, 
  Chrome, Circle, Cloud, Clover, Code, Coffee, 
  Coins, Compass, Component, Cookie, Cpu, Crown, 
  Database, Diamond, Disc, Dna, Dog, DollarSign, 
  Droplet, Drum, Ear, Egg, Eye, Feather, 
  Figma, File, Filter, Flag, Flame, Flashlight, 
  Flower, Folder, Frame, Gamepad, Gem, Ghost, 
  Gift, GitBranch, Glasses, Globe, GraduationCap, Grape, 
  Hammer, HardDrive, Hash, Headphones, Heart, Hexagon, 
  Hourglass, Image, Infinity, Key, Lamp, Layers, 
  Leaf, Library, LifeBuoy, Lightbulb, Link, Lock, 
  Magnet, Map, Medal, Megaphone, Menu, Mic, 
  Microscope, Milestone, Milk, Moon, Mouse, Music, 
  Navigation, Network, Octagon, Package, Palette, Paperclip, 
  Pause, Pen, Phone, PieChart, Pin, Plane, 
  Play, Plug, Pocket, Podcast, Power, Printer, 
  Puzzle, QrCode, Radio, Rainbow, Rocket, RotateCw, 
  Rss, Ruler, Save, Scale, Scissors, ScreenShare, 
  Search, Send, Server, Settings, Share, Shield, 
  Ship, Shirt, ShoppingBag, Shovel, Shuffle, Signal, 
  Skull, Slash, Smartphone, Smile, Snowflake, Sofa, 
  Speaker, Sprout, Square, Star, Stethoscope, Sticker, 
  StopCircle, Store, Sun, Sunrise, Sunset, Sword, 
  Table, Tablet, Tag, Target, Tent, Terminal, 
  Thermometer, ThumbsUp, Ticket, Timer, ToggleLeft, 
  Tornado, Trash, TreeDeciduous, TreePine, Triangle, Trophy, 
  Truck, Tv, Twitch, Twitter, Umbrella, Unlock, 
  Upload, User, Utensils, Vault, Video, Voicemail, 
  Volume, Wallet, Watch, Waves, Webcam, Wifi, 
  Wind, Wine, WrapText, Wrench, X, Youtube, 
  ZapOff, ZoomIn 
} from 'lucide-react';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.EASY]: {
    gridSize: 3,
    swapIntervalBase: 3000,
    pointsPerRound: 100,
    label: 'Easy (3x3)',
    itemsToSwap: 2,
  },
  [Difficulty.NORMAL]: {
    gridSize: 4,
    swapIntervalBase: 2500,
    pointsPerRound: 150,
    label: 'Normal (4x4)',
    itemsToSwap: 2,
  },
  [Difficulty.HARD]: {
    gridSize: 5,
    swapIntervalBase: 2000,
    pointsPerRound: 250,
    label: 'Hard (5x5)',
    itemsToSwap: 2,
  },
  [Difficulty.EXPERT]: {
    gridSize: 6,
    swapIntervalBase: 1800,
    pointsPerRound: 400,
    label: 'Expert (6x6)',
    itemsToSwap: 2,
  },
  [Difficulty.MASTER]: {
    gridSize: 8,
    swapIntervalBase: 1500,
    pointsPerRound: 600,
    label: 'Master (8x8)',
    itemsToSwap: 3,
  },
  [Difficulty.LEGEND]: {
    gridSize: 10,
    swapIntervalBase: 1200,
    pointsPerRound: 1000,
    label: 'Legend (10x10)',
    itemsToSwap: 3,
  },
};

export const PASTEL_COLORS = [
  '#7dd3fc', // Blue
  '#d8b4fe', // Purple
  '#86efac', // Green
  '#fda4af', // Red/Pink
  '#fde047', // Yellow
  '#fdba74', // Orange
  '#f0abfc', // Fuchsia
  '#67e8f9', // Cyan
];

// Mapping string names to actual components for rendering
export const ICON_MAP: Record<string, any> = {
    Zap, Anchor, Aperture, Archive, Asterisk, Award, 
    Banana, Beaker, Bell, Binary, Bird, Bitcoin, 
    Bluetooth, Bomb, Bone, Box, Briefcase, Bug, 
    Camera, Candy, Car, Carrot, Cast, Cat, 
    Chrome, Circle, Cloud, Clover, Code, Coffee, 
    Coins, Compass, Component, Cookie, Cpu, Crown, 
    Database, Diamond, Disc, Dna, Dog, DollarSign, 
    Droplet, Drum, Ear, Egg, Eye, Feather, 
    Figma, File, Filter, Flag, Flame, Flashlight, 
    Flower, Folder, Frame, Gamepad, Gem, Ghost, 
    Gift, GitBranch, Glasses, Globe, GraduationCap, Grape, 
    Hammer, HardDrive, Hash, Headphones, Heart, Hexagon, 
    Hourglass, Image, Infinity, Key, Lamp, Layers, 
    Leaf, Library, LifeBuoy, Lightbulb, Link, Lock, 
    Magnet, Map, Medal, Megaphone, Menu, Mic, 
    Microscope, Milestone, Milk, Moon, Mouse, Music, 
    Navigation, Network, Octagon, Package, Palette, Paperclip, 
    Pause, Pen, Phone, PieChart, Pin, Plane, 
    Play, Plug, Pocket, Podcast, Power, Printer, 
    Puzzle, QrCode, Radio, Rainbow, Rocket, RotateCw, 
    Rss, Ruler, Save, Scale, Scissors, ScreenShare, 
    Search, Send, Server, Settings, Share, Shield, 
    Ship, Shirt, ShoppingBag, Shovel, Shuffle, Signal, 
    Skull, Slash, Smartphone, Smile, Snowflake, Sofa, 
    Speaker, Sprout, Square, Star, Stethoscope, Sticker, 
    StopCircle, Store, Sun, Sunrise, Sunset, Sword, 
    Table, Tablet, Tag, Target, Tent, Terminal, 
    Thermometer, ThumbsUp, Ticket, Timer, ToggleLeft, 
    Tornado, Trash, TreeDeciduous, TreePine, Triangle, Trophy, 
    Truck, Tv, Twitch, Twitter, Umbrella, Unlock, 
    Upload, User, Utensils, Vault, Video, Voicemail, 
    Volume, Wallet, Watch, Waves, Webcam, Wifi, 
    Wind, Wine, WrapText, Wrench, X, Youtube, 
    ZapOff, ZoomIn 
};

export const ICON_KEYS = Object.keys(ICON_MAP);