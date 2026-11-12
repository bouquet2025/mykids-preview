// Данные для прототипа. Источник: mykids-website/js/locations.js. Есик: адрес, график и WhatsApp получены 12.11.2026, ссылки 2ГИС пока нет.
// WhatsApp = рабочий номер парка (в CMS будет отдельное поле).
const PARKS = [
  {slug:"dala-mall",city:"Шымкент",citySlug:"shymkent",name:"Dala Mall",addr:"Алматинская трасса, 13а",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080580688",map:"https://go.2gis.com/PTyx6"},
  {slug:"royal-plaza",city:"Шымкент",citySlug:"shymkent",name:"Royal Plaza",addr:"ул. Рыскулова, 8а/5",hours:"Ежедневно, с 10:00 до 22:00 (вт: санитарный день, с 10:00 до 14:00)",wa:"77080580474",map:"https://go.2gis.com/AdGvP"},
  {slug:"city-mall",city:"Шымкент",citySlug:"shymkent",name:"Shymkent City Mall",addr:"пр. Байдибек би, 362/7",hours:"Ежедневно, с 11:00 до 23:00",wa:"77080580208",map:"https://go.2gis.com/F8Xiy"},
  {slug:"atakent",city:"Алматы",citySlug:"almaty",name:"Atakent Mall",addr:"ул. Тимирязева, 42 к3",hours:"Ежедневно, с 10:00 до 21:00",wa:"77080580476",map:"https://go.2gis.com/LH5Ee"},
  {slug:"alatau-plaza",city:"Алматы",citySlug:"almaty",name:"Alatau Plaza",addr:"ул. Ырысты, 46/4",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080580401",map:"https://go.2gis.com/9OVj2"},
  {slug:"esik",city:"Есик",citySlug:"esik",name:"ТРК Turan",addr:"ул. Алтын Адам, 119е (ТРК Turan, 4 и 5 этаж)",hours:"Ежедневно, с 10:00 до 22:00",wa:"77002012924",map:""},
  {slug:"temirtau",city:"Темиртау",citySlug:"temirtau",name:"Темиртау",addr:"6-й микрорайон, 34/1",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080580488",map:"https://go.2gis.com/I7S8k"},
  {slug:"karaganda",city:"Караганда",citySlug:"karaganda",name:"KAZMART",addr:"пр. Республики, 9",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080558088",map:"https://go.2gis.com/lMHeB"},
  {slug:"aktau",city:"Актау",citySlug:"aktau",name:"ТРК Актау",addr:"16-й микрорайон, 4",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080580472",map:"https://go.2gis.com/yIbnV"},
  {slug:"aktobe",city:"Актобе",citySlug:"aktobe",name:"Dalida Plaza",addr:"пр. Алии Молдагуловой, 72а",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080580780",map:"https://go.2gis.com/a86UL"},
  {slug:"uralsk",city:"Уральск",citySlug:"uralsk",name:"ТРК Орал",addr:"пр. Абулхаир хана, 179",hours:"Ежедневно, с 10:00 до 22:00",wa:"77080580470",map:"https://go.2gis.com/QzIYR"}
];
