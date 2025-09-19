import { mapCandidateStatusEnum } from '../enumMapper';
import { CandidateStatusEnum } from '../../api/models';

describe('enumMapper', () => {
  describe('mapCandidateStatusEnum', () => {
    it('маппит корректные значения статусов', () => {
      expect(mapCandidateStatusEnum('NEW')).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum('IN_PROGRESS')).toBe(CandidateStatusEnum.IN_PROGRESS);
      expect(mapCandidateStatusEnum('FINISHED')).toBe(CandidateStatusEnum.FINISHED);
      expect(mapCandidateStatusEnum('REJECTED')).toBe(CandidateStatusEnum.REJECTED);
      expect(mapCandidateStatusEnum('HIRED')).toBe(CandidateStatusEnum.HIRED);
    });

    it('маппит значения в нижнем регистре', () => {
      expect(mapCandidateStatusEnum('new')).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum('in_progress')).toBe(CandidateStatusEnum.IN_PROGRESS);
      expect(mapCandidateStatusEnum('finished')).toBe(CandidateStatusEnum.FINISHED);
      expect(mapCandidateStatusEnum('rejected')).toBe(CandidateStatusEnum.REJECTED);
      expect(mapCandidateStatusEnum('hired')).toBe(CandidateStatusEnum.HIRED);
    });

    it('маппит значения в смешанном регистре', () => {
      expect(mapCandidateStatusEnum('New')).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum('In_Progress')).toBe(CandidateStatusEnum.IN_PROGRESS);
      expect(mapCandidateStatusEnum('Finished')).toBe(CandidateStatusEnum.FINISHED);
    });

    it('возвращает NEW для null и undefined', () => {
      expect(mapCandidateStatusEnum(null)).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum(undefined)).toBe(CandidateStatusEnum.NEW);
    });

    it('возвращает NEW для пустой строки', () => {
      expect(mapCandidateStatusEnum('')).toBe(CandidateStatusEnum.NEW);
    });

    it('возвращает NEW и логирует предупреждение для неизвестных значений', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      expect(mapCandidateStatusEnum('UNKNOWN_STATUS')).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum('INVALID')).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum('123')).toBe(CandidateStatusEnum.NEW);
      
      expect(consoleSpy).toHaveBeenCalledWith('Unknown candidate status: "UNKNOWN_STATUS", mapping to NEW');
      expect(consoleSpy).toHaveBeenCalledWith('Unknown candidate status: "INVALID", mapping to NEW');
      expect(consoleSpy).toHaveBeenCalledWith('Unknown candidate status: "123", mapping to NEW');
      
      consoleSpy.mockRestore();
    });

    it('обрабатывает пробелы в значениях', () => {
      expect(mapCandidateStatusEnum('  NEW  ')).toBe(CandidateStatusEnum.NEW);
      expect(mapCandidateStatusEnum(' in_progress ')).toBe(CandidateStatusEnum.IN_PROGRESS);
    });
  });
});