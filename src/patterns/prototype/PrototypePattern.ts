/**
 * PROTOTYPE PATTERN
 *
 * The Prototype Pattern creates new objects by cloning existing ones (prototypes).
 * In JavaScript, objects can inherit directly from other objects through
 * prototypal inheritance.
 *
 * Benefits:
 * - Avoid expensive object creation (clone instead of construct)
 * - Create objects without knowing their exact class
 * - Dynamic configuration of objects at runtime
 * - Reduce subclassing by cloning configured prototypes
 */

// ============================================
// EXAMPLE 1: Basic Object Cloning
// ============================================

export interface Cloneable<T> {
  clone(): T;
}

// User prototype with clone capability
export class UserPrototype implements Cloneable<UserPrototype> {
  name: string;
  email: string;
  role: string;
  preferences: { theme: string; language: string };

  constructor(
    name: string,
    email: string,
    role: string,
    preferences: { theme: string; language: string }
  ) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.preferences = preferences;
  }

  clone(): UserPrototype {
    // Deep clone the preferences object
    return new UserPrototype(this.name, this.email, this.role, {
      ...this.preferences,
    });
  }

  greet(): string {
    return `Hello, I'm ${this.name} (${this.role})`;
  }
}

// ============================================
// EXAMPLE 2: Vehicle Prototype Factory
// ============================================

export interface VehicleConfig {
  brand: string;
  model: string;
  year: number;
  features: string[];
  specs: {
    engine: string;
    horsepower: number;
    transmission: "manual" | "automatic";
  };
}

export class VehiclePrototype implements Cloneable<VehiclePrototype> {
  config: VehicleConfig;

  constructor(config: VehicleConfig) {
    this.config = config;
  }

  clone(): VehiclePrototype {
    // Deep clone the entire config
    return new VehiclePrototype({
      ...this.config,
      features: [...this.config.features],
      specs: { ...this.config.specs },
    });
  }

  describe(): string {
    return `${this.config.year} ${this.config.brand} ${this.config.model} - ${this.config.specs.horsepower}HP`;
  }

  addFeature(feature: string): void {
    this.config.features.push(feature);
  }
}

// Pre-configured vehicle prototypes
export const VehiclePrototypes = {
  sedan: new VehiclePrototype({
    brand: "Generic",
    model: "Sedan",
    year: 2024,
    features: ["Air Conditioning", "Power Windows", "Bluetooth"],
    specs: { engine: "2.0L I4", horsepower: 150, transmission: "automatic" },
  }),

  suv: new VehiclePrototype({
    brand: "Generic",
    model: "SUV",
    year: 2024,
    features: ["Air Conditioning", "Power Windows", "4WD", "Roof Rack"],
    specs: { engine: "3.5L V6", horsepower: 280, transmission: "automatic" },
  }),

  sports: new VehiclePrototype({
    brand: "Generic",
    model: "Sports Car",
    year: 2024,
    features: ["Sport Suspension", "Launch Control", "Carbon Fiber Body"],
    specs: { engine: "4.0L V8", horsepower: 450, transmission: "manual" },
  }),
};

// Factory function using prototypes
export const createVehicle = (
  type: keyof typeof VehiclePrototypes,
  customizations?: Partial<VehicleConfig>
): VehiclePrototype => {
  const prototype = VehiclePrototypes[type];
  const vehicle = prototype.clone();

  if (customizations) {
    Object.assign(vehicle.config, customizations);
    if (customizations.features) {
      vehicle.config.features = [...customizations.features];
    }
    if (customizations.specs) {
      vehicle.config.specs = {
        ...vehicle.config.specs,
        ...customizations.specs,
      };
    }
  }

  return vehicle;
};

// ============================================
// EXAMPLE 3: Document Template Prototype
// ============================================

export interface DocumentSection {
  title: string;
  content: string;
  order: number;
}

export class DocumentPrototype implements Cloneable<DocumentPrototype> {
  title: string;
  author: string;
  sections: DocumentSection[];
  metadata: Record<string, string>;

  constructor(
    title: string,
    author: string,
    sections: DocumentSection[],
    metadata: Record<string, string>
  ) {
    this.title = title;
    this.author = author;
    this.sections = sections;
    this.metadata = metadata;
  }

  clone(): DocumentPrototype {
    return new DocumentPrototype(
      this.title,
      this.author,
      this.sections.map((s) => ({ ...s })),
      { ...this.metadata }
    );
  }

  addSection(section: DocumentSection): void {
    this.sections.push(section);
    this.sections.sort((a, b) => a.order - b.order);
  }

  removeSection(title: string): void {
    this.sections = this.sections.filter((s) => s.title !== title);
  }

  getSummary(): string {
    return `"${this.title}" by ${this.author} - ${this.sections.length} sections`;
  }
}

// Pre-configured document templates
export const DocumentTemplates = {
  report: new DocumentPrototype(
    "Report Template",
    "",
    [
      { title: "Executive Summary", content: "", order: 1 },
      { title: "Introduction", content: "", order: 2 },
      { title: "Findings", content: "", order: 3 },
      { title: "Conclusion", content: "", order: 4 },
    ],
    { type: "report", format: "pdf" }
  ),

  proposal: new DocumentPrototype(
    "Proposal Template",
    "",
    [
      { title: "Overview", content: "", order: 1 },
      { title: "Problem Statement", content: "", order: 2 },
      { title: "Proposed Solution", content: "", order: 3 },
      { title: "Budget", content: "", order: 4 },
      { title: "Timeline", content: "", order: 5 },
    ],
    { type: "proposal", format: "pdf" }
  ),

  readme: new DocumentPrototype(
    "README Template",
    "",
    [
      { title: "Project Name", content: "", order: 1 },
      { title: "Installation", content: "", order: 2 },
      { title: "Usage", content: "", order: 3 },
      { title: "Contributing", content: "", order: 4 },
      { title: "License", content: "", order: 5 },
    ],
    { type: "documentation", format: "md" }
  ),
};

// ============================================
// EXAMPLE 4: Game Character Prototype Registry
// ============================================

export interface CharacterStats {
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface CharacterAbility {
  name: string;
  damage: number;
  cooldown: number;
}

export class GameCharacter implements Cloneable<GameCharacter> {
  name: string;
  characterClass: string;
  level: number;
  stats: CharacterStats;
  abilities: CharacterAbility[];

  constructor(
    name: string,
    characterClass: string,
    level: number,
    stats: CharacterStats,
    abilities: CharacterAbility[]
  ) {
    this.name = name;
    this.characterClass = characterClass;
    this.level = level;
    this.stats = stats;
    this.abilities = abilities;
  }

  clone(): GameCharacter {
    return new GameCharacter(
      this.name,
      this.characterClass,
      this.level,
      { ...this.stats },
      this.abilities.map((a) => ({ ...a }))
    );
  }

  levelUp(): void {
    this.level++;
    this.stats.health += 10;
    this.stats.attack += 2;
    this.stats.defense += 2;
    this.stats.speed += 1;
  }

  getInfo(): string {
    return `${this.name} - Level ${this.level} ${this.characterClass}`;
  }
}

// Prototype Registry for managing prototypes
export class CharacterRegistry {
  private prototypes: Map<string, GameCharacter> = new Map();

  register(key: string, prototype: GameCharacter): void {
    this.prototypes.set(key, prototype);
  }

  unregister(key: string): void {
    this.prototypes.delete(key);
  }

  create(key: string, customName?: string): GameCharacter | null {
    const prototype = this.prototypes.get(key);
    if (!prototype) return null;

    const character = prototype.clone();
    if (customName) {
      character.name = customName;
    }
    return character;
  }

  getAvailable(): string[] {
    return Array.from(this.prototypes.keys());
  }
}

// Pre-configured character registry
export const characterRegistry = new CharacterRegistry();

characterRegistry.register(
  "warrior",
  new GameCharacter(
    "Warrior",
    "Warrior",
    1,
    { health: 100, attack: 15, defense: 12, speed: 8 },
    [
      { name: "Slash", damage: 20, cooldown: 0 },
      { name: "Shield Bash", damage: 15, cooldown: 3 },
    ]
  )
);

characterRegistry.register(
  "mage",
  new GameCharacter(
    "Mage",
    "Mage",
    1,
    { health: 60, attack: 20, defense: 5, speed: 10 },
    [
      { name: "Fireball", damage: 30, cooldown: 2 },
      { name: "Ice Shard", damage: 25, cooldown: 1 },
    ]
  )
);

characterRegistry.register(
  "rogue",
  new GameCharacter(
    "Rogue",
    "Rogue",
    1,
    { health: 70, attack: 18, defense: 7, speed: 15 },
    [
      { name: "Backstab", damage: 35, cooldown: 3 },
      { name: "Poison Dart", damage: 15, cooldown: 1 },
    ]
  )
);
