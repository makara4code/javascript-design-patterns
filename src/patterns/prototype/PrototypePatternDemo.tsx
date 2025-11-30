import { useState, useCallback } from "react";
import {
  UserPrototype,
  createVehicle,
  VehiclePrototype,
  DocumentTemplates,
  DocumentPrototype,
  characterRegistry,
  GameCharacter,
} from "./PrototypePattern";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { CodeBlock } from "@/components/ui/code-block";

let idCounter = 0;
const generateId = () => ++idCounter;

/**
 * Prototype Pattern Demo Component
 */
export const PrototypePatternDemo = () => {
  const [users, setUsers] = useState<UserPrototype[]>(() => [
    new UserPrototype("John Doe", "john@example.com", "admin", {
      theme: "dark",
      language: "en",
    }),
  ]);

  const [vehicles, setVehicles] = useState<VehiclePrototype[]>([]);
  const [documents, setDocuments] = useState<DocumentPrototype[]>([]);
  const [characters, setCharacters] = useState<GameCharacter[]>([]);

  const cloneUser = useCallback((user: UserPrototype) => {
    const cloned = user.clone();
    cloned.name = `${user.name} (Clone)`;
    cloned.email = `clone_${generateId()}@example.com`;
    setUsers((prev) => [...prev, cloned]);
  }, []);

  const createVehicleFromPrototype = useCallback(
    (type: "sedan" | "suv" | "sports") => {
      const brands = ["Toyota", "Honda", "Ford", "BMW", "Mercedes"];
      const randomBrand = brands[Math.floor(Math.random() * brands.length)];

      const vehicle = createVehicle(type, {
        brand: randomBrand,
        year: 2024,
      });

      setVehicles((prev) => [...prev, vehicle]);
    },
    []
  );

  const createDocumentFromTemplate = useCallback(
    (type: keyof typeof DocumentTemplates) => {
      const doc = DocumentTemplates[type].clone();
      doc.title = `My ${type.charAt(0).toUpperCase() + type.slice(1)} #${generateId()}`;
      doc.author = "Current User";
      setDocuments((prev) => [...prev, doc]);
    },
    []
  );

  const createCharacter = useCallback((type: string) => {
    const name = `${type.charAt(0).toUpperCase() + type.slice(1)}_${generateId()}`;
    const character = characterRegistry.create(type, name);
    if (character) {
      setCharacters((prev) => [...prev, character]);
    }
  }, []);

  const levelUpCharacter = (index: number) => {
    const updated = [...characters];
    updated[index].levelUp();
    setCharacters(updated);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Prototype Pattern"
        description="Creates new objects by cloning existing prototypes for efficient object creation."
        badge={{ text: "JavaScript", variant: "js" }}
      />

      <Card>
        <CardHeader>
          <CardTitle>What is the Prototype Pattern?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The <strong>Prototype Pattern</strong> creates new objects by
            cloning existing ones. This avoids expensive object creation and
            allows creating objects without knowing their exact class.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Clone complex objects efficiently</li>
              <li>Create objects dynamically at runtime</li>
              <li>Reduce subclassing by using configured prototypes</li>
              <li>Registry pattern for managing prototypes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* User Cloning Demo */}
      <Card>
        <CardHeader>
          <CardTitle>1. Basic Object Cloning</CardTitle>
          <CardDescription>
            Clone a user object while modifying some properties. The clone is
            independent of the original.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <strong className="text-lg">{user.name}</strong>
                  <p className="text-sm text-muted-foreground">
                    {user.email} ({user.role})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Theme: {user.preferences.theme}, Lang:{" "}
                    {user.preferences.language}
                  </p>
                </div>
                <Button variant="outline" onClick={() => cloneUser(user)}>
                  Clone This User
                </Button>
              </div>
            ))}
          </div>

          <CodeBlock
            language="typescript"
            code={`class UserPrototype {
  clone(): UserPrototype {
    return new UserPrototype(
      this.name,
      this.email,
      this.role,
      { ...this.preferences }  // Deep clone
    );
  }
}`}
          />
        </CardContent>
      </Card>

      {/* Vehicle Factory Demo */}
      <Card>
        <CardHeader>
          <CardTitle>2. Vehicle Factory with Prototypes</CardTitle>
          <CardDescription>
            Pre-configured vehicle prototypes are cloned and customized to
            create new instances.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => createVehicleFromPrototype("sedan")}
            >
              Create Sedan
            </Button>
            <Button
              variant="outline"
              onClick={() => createVehicleFromPrototype("suv")}
            >
              Create SUV
            </Button>
            <Button
              variant="outline"
              onClick={() => createVehicleFromPrototype("sports")}
            >
              Create Sports Car
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            {vehicles.length === 0 ? (
              <p className="text-center text-muted-foreground italic py-4">
                No vehicles created yet
              </p>
            ) : (
              <div className="space-y-3">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={index}
                    className="bg-background p-3 rounded border"
                  >
                    <strong>{vehicle.describe()}</strong>
                    <p className="text-sm text-muted-foreground">
                      Features: {vehicle.config.features.join(", ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Transmission: {vehicle.config.specs.transmission}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Template Demo */}
      <Card>
        <CardHeader>
          <CardTitle>3. Document Templates</CardTitle>
          <CardDescription>
            Clone document templates to create new documents with pre-defined
            structure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => createDocumentFromTemplate("report")}
            >
              New Report
            </Button>
            <Button
              variant="outline"
              onClick={() => createDocumentFromTemplate("proposal")}
            >
              New Proposal
            </Button>
            <Button
              variant="outline"
              onClick={() => createDocumentFromTemplate("readme")}
            >
              New README
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            {documents.length === 0 ? (
              <p className="text-center text-muted-foreground italic py-4">
                No documents created yet
              </p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-background p-3 rounded border"
                  >
                    <strong>{doc.title}</strong>
                    <p className="text-sm text-muted-foreground">
                      By: {doc.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sections: {doc.sections.map((s) => s.title).join(" → ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Format: {doc.metadata.format}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Character Registry Demo */}
      <Card>
        <CardHeader>
          <CardTitle>4. Character Registry (Prototype Registry)</CardTitle>
          <CardDescription>
            A registry manages prototypes and creates new instances on demand.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => createCharacter("warrior")}>
              Create Warrior
            </Button>
            <Button variant="outline" onClick={() => createCharacter("mage")}>
              Create Mage
            </Button>
            <Button variant="outline" onClick={() => createCharacter("rogue")}>
              Create Rogue
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-4">
            <p>
              <strong>Available Classes:</strong>{" "}
              {characterRegistry.getAvailable().join(", ")}
            </p>

            {characters.length === 0 ? (
              <p className="text-center text-muted-foreground italic py-4">
                No characters created yet
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((char, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h4 className="font-bold mb-2">{char.getInfo()}</h4>
                      <div className="flex gap-3 text-sm mb-2">
                        <span>❤️ {char.stats.health}</span>
                        <span>⚔️ {char.stats.attack}</span>
                        <span>🛡️ {char.stats.defense}</span>
                        <span>💨 {char.stats.speed}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Abilities:</strong>{" "}
                        {char.abilities.map((a) => a.name).join(", ")}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => levelUpCharacter(index)}
                      >
                        Level Up
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <CodeBlock
            language="typescript"
            code={`class CharacterRegistry {
  private prototypes = new Map<string, GameCharacter>();

  register(key: string, prototype: GameCharacter) {
    this.prototypes.set(key, prototype);
  }

  create(key: string, name?: string) {
    const prototype = this.prototypes.get(key);
    if (!prototype) return null;
    const character = prototype.clone();
    if (name) character.name = name;
    return character;
  }
}`}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PrototypePatternDemo;
