import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: '1',
    name: 'Жилищна сграда А1',
    location: 'София, Младост',
    active: true,
    podObekti: [
      {
        id: 'fasada-iztok',
        name: 'Фасада Изток',
        smr: [
          {
            id: 's1',
            name: 'Топлоизолация',
            active: true,
            progress: 65,
            brigade: 'Бригада Иванов',
          },
          {
            id: 's2',
            name: 'Мазилка',
            active: true,
            progress: 30,
            brigade: 'Бригада Петров',
          },
          {
            id: 's3',
            name: 'Шпакловане',
            active: false,
            progress: 100,
            brigade: 'Бригада Иванов',
          },
        ],
      },
      {
        id: 'fasada-zapad',
        name: 'Фасада Запад',
        smr: [
          {
            id: 's4',
            name: 'Топлоизолация',
            active: true,
            progress: 20,
            brigade: 'Бригада Петров',
          },
          {
            id: 's5',
            name: 'Рязане желяза',
            active: false,
            progress: 100,
            brigade: 'Бригада Димов',
          },
        ],
      },
      {
        id: 'fasada-sever',
        name: 'Фасада Север',
        smr: [
          {
            id: 's6',
            name: 'Мазилка',
            active: true,
            progress: 10,
            brigade: 'Бригада Димов',
          },
          {
            id: 's7',
            name: 'Шпакловане',
            active: true,
            progress: 45,
            brigade: 'Бригада Иванов',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Офис комплекс Б',
    location: 'Пловдив, Центъра',
    active: true,
    podObekti: [
      {
        id: 'etaj-1',
        name: 'Етаж 1',
        smr: [
          {
            id: 's8',
            name: 'Замазка',
            active: true,
            progress: 80,
            brigade: 'Бригада Петров',
          },
          {
            id: 's9',
            name: 'Електро',
            active: true,
            progress: 55,
            brigade: 'Бригада Димов',
          },
          {
            id: 's10',
            name: 'Шпакловане',
            active: false,
            progress: 100,
            brigade: 'Бригада Иванов',
          },
        ],
      },
      {
        id: 'etaj-2',
        name: 'Етаж 2',
        smr: [
          {
            id: 's11',
            name: 'Замазка',
            active: false,
            progress: 100,
            brigade: 'Бригада Петров',
          },
          {
            id: 's12',
            name: 'Шпакловане',
            active: true,
            progress: 15,
            brigade: 'Бригада Иванов',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Вила Морска',
    location: 'Варна, к.к. Св. Св.',
    active: true,
    podObekti: [
      {
        id: 'sekciq-a',
        name: 'Секция А',
        smr: [
          {
            id: 's13',
            name: 'Мазилка',
            active: true,
            progress: 50,
            brigade: 'Бригада Димов',
          },
          {
            id: 's14',
            name: 'Топлоизолация',
            active: true,
            progress: 70,
            brigade: 'Бригада Петров',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Склад Логистика',
    location: 'Русе, Индустриална',
    active: false,
    podObekti: [],
  },
  {
    id: '5',
    name: 'Хотел Планински',
    location: 'Банско, Центъра',
    active: false,
    podObekti: [],
  },
];

export function getProject(id: string) {
  return projects.find((p) => p.id === id) ?? null;
}

export function getPodObekt(projectId: string, podId: string) {
  const project = getProject(projectId);
  return project?.podObekti.find((p) => p.id === podId) ?? null;
}
