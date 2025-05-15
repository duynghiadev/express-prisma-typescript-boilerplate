import express from "express";
import HeroNotFoundException from "../exceptions/hero-not-found-exception";
import { BaseController } from "./abstractions/base-controller";

export default class HeroController extends BaseController {
  public path = "/heroes";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllHero);
    this.router.post(this.path, this.addHero);
    this.router.get(this.path + "/:heroId", this.getHeroById);
    this.router.put(this.path + "/:heroId", this.updateHero);
    this.router.delete(this.path + "/:heroId", this.deleteHero);
  }

  getHeroById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const heroId = Number.parseInt(request.params.heroId);
    this.prisma.hero
      .findUnique({
        where: {
          id: heroId,
        },
      })
      .then((hero) => {
        if (hero) {
          response.json(hero);
        } else {
          next(new HeroNotFoundException(heroId));
        }
      });
  };

  getAllHero = async (request: express.Request, response: express.Response) => {
    const heroes = await this.prisma.hero.findMany();
    response.json(heroes);
  };

  addHero = async (request: express.Request, response: express.Response) => {
    const reqBody = request.body;
    const hero = await this.prisma.hero.create({
      data: {
        name: reqBody.name,
        origin: reqBody.origin,
        description: reqBody.description,
      },
    });
    response.json(hero);
  };

  updateHero = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const heroId = Number.parseInt(request.params.heroId);
    const reqBody = request.body;
    const hero = await this.prisma.hero.findUnique({
      where: {
        id: heroId,
      },
    });

    if (hero) {
      const updatedHero = await this.prisma.hero.update({
        where: {
          id: heroId,
        },
        data: {
          name: reqBody.name,
          origin: reqBody.origin,
          description: reqBody.description,
        },
      });
      response.json(updatedHero);
    } else {
      next(new HeroNotFoundException(heroId));
    }
  };

  deleteHero = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    const heroId = Number.parseInt(request.params.heroId);
    const hero = await this.prisma.hero.findUnique({
      where: {
        id: heroId,
      },
    });

    if (hero) {
      await this.prisma.hero.delete({
        where: {
          id: heroId,
        },
      });
      response.json({ message: `Hero with id ${heroId} was deleted` });
    } else {
      next(new HeroNotFoundException(heroId));
    }
  };
}
