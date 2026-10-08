jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

jest.mock('node:fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));

import { unlink } from 'node:fs/promises';
import { ChurchInfoService } from './church-info.service';

describe('ChurchInfoService', () => {
  it('removes prior uploaded images when replacing the about, pastor, and hero image fields', async () => {
    const repository = {
      findOne: jest.fn().mockResolvedValue({
        aboutUsImage: '/uploads/church-info/old-about.jpg',
        pastorAvatar: '/uploads/church-info/old-pastor.jpg',
        aboutHeroImage: '/uploads/church-info/old-about-hero.jpg',
        giveHeroImage: '/uploads/church-info/old-give-hero.jpg',
        eventHeroImage: '/uploads/church-info/old-event-hero.jpg',
        galleryHeroImage: '/uploads/church-info/old-gallery-hero.jpg',
        ministryHeroImage: '/uploads/church-info/old-ministry-hero.jpg',
        sermonsHeroImage: '/uploads/church-info/old-sermons-hero.jpg',
      }),
      create: jest.fn((value) => value),
      save: jest.fn(async (value) => value),
    };

    const service = new ChurchInfoService(repository as any);

    await service.update({
      aboutUsImage: '/uploads/church-info/new-about.jpg',
      pastorAvatar: '/uploads/church-info/new-pastor.jpg',
      aboutHeroImage: null,
      giveHeroImage: '/uploads/church-info/new-give-hero.jpg',
      eventHeroImage: '/uploads/church-info/new-event-hero.jpg',
      galleryHeroImage: '/uploads/church-info/new-gallery-hero.jpg',
      ministryHeroImage: '/uploads/church-info/new-ministry-hero.jpg',
      sermonsHeroImage: '/uploads/church-info/new-sermons-hero.jpg',
    });

    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-about.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-pastor.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-about-hero.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-give-hero.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-event-hero.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-gallery-hero.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-ministry-hero.jpg'),
    );
    expect(unlink).toHaveBeenCalledWith(
      expect.stringContaining('old-sermons-hero.jpg'),
    );
  });
});
