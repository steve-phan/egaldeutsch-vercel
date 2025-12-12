const fs = require('fs');
const path = require('path');

// This script expands the dictionary with comprehensive noun coverage for each letter
// It generates nouns programmatically to create a complete A1-B1 level dictionary

const lettersDir = path.join(__dirname, '../public/data/dictionary/letters');

// Load existing dictionary to get the highest ID
function getHighestId() {
  const files = fs.readdirSync(lettersDir).filter(f => f.endsWith('.json'));
  let maxId = 266;
  
  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(lettersDir, file), 'utf8'));
    Object.keys(data.entries).forEach(id => {
      const num = parseInt(id.replace('ID', ''));
      if (num > maxId) maxId = num;
    });
  });
  
  return maxId;
}

let currentId = getHighestId() + 1;

function generateId() {
  return `ID${String(currentId++).padStart(3, '0')}`;
}

// Comprehensive noun data by letter
const nounsData = {
  a: [
    // Already added in manual expansion
  ],
  b: [
    { word: "Backofen", artikel: "der", plural: "Backöfen", english: "oven", vietnamese: "lò nướng", definition_en: "A chamber for baking or heating.", definition_vi: "Một buồng để nướng hoặc sưởi ấm.", example: { de: "Der Backofen ist heiß.", en: "The oven is hot.", vi: "Lò nướng nóng." } },
    { word: "Balkon", artikel: "der", plural: "Balkone", english: "balcony", vietnamese: "ban công", definition_en: "A platform on a building with a wall or railing.", definition_vi: "Một sân thượng trên tòa nhà có tường hoặc lan can.", example: { de: "Der Balkon ist schön.", en: "The balcony is nice.", vi: "Ban công đẹp." } },
    { word: "Ball", artikel: "der", plural: "Bälle", english: "ball", vietnamese: "quả bóng", definition_en: "A round object used in games.", definition_vi: "Một vật tròn dùng trong trò chơi.", example: { de: "Der Ball ist rund.", en: "The ball is round.", vi: "Quả bóng tròn." } },
    { word: "Bank", artikel: "die", plural: "Banken", english: "bank", vietnamese: "ngân hàng", definition_en: "A financial institution.", definition_vi: "Một tổ chức tài chính.", example: { de: "Die Bank ist geschlossen.", en: "The bank is closed.", vi: "Ngân hàng đóng cửa." } },
    { word: "Batterie", artikel: "die", plural: "Batterien", english: "battery", vietnamese: "pin", definition_en: "A device that stores electrical energy.", definition_vi: "Một thiết bị lưu trữ năng lượng điện.", example: { de: "Die Batterie ist leer.", en: "The battery is empty.", vi: "Pin hết." } },
    { word: "Baum", artikel: "der", plural: "Bäume", english: "tree", vietnamese: "cây", definition_en: "A tall plant with a trunk and branches.", definition_vi: "Một cây cao có thân và cành.", example: { de: "Der Baum ist groß.", en: "The tree is big.", vi: "Cây lớn." } },
    { word: "Becher", artikel: "der", plural: "Becher", english: "cup", vietnamese: "cốc", definition_en: "A small container for drinking.", definition_vi: "Một vật nhỏ dùng để uống.", example: { de: "Der Becher ist voll.", en: "The cup is full.", vi: "Cốc đầy." } },
    { word: "Bein", artikel: "das", plural: "Beine", english: "leg", vietnamese: "chân", definition_en: "The lower limb of the body.", definition_vi: "Chi dưới của cơ thể.", example: { de: "Das Bein tut weh.", en: "The leg hurts.", vi: "Chân đau." } },
    { word: "Beispiel", artikel: "das", plural: "Beispiele", english: "example", vietnamese: "ví dụ", definition_en: "An instance that illustrates something.", definition_vi: "Một trường hợp minh họa điều gì đó.", example: { de: "Das ist ein gutes Beispiel.", en: "That is a good example.", vi: "Đó là một ví dụ tốt." } },
    { word: "Beruf", artikel: "der", plural: "Berufe", english: "profession", vietnamese: "nghề nghiệp", definition_en: "A type of job requiring special training.", definition_vi: "Một loại công việc đòi hỏi đào tạo đặc biệt.", example: { de: "Was ist dein Beruf?", en: "What is your profession?", vi: "Nghề của bạn là gì?" } },
    { word: "Besuch", artikel: "der", plural: "Besuche", english: "visit", vietnamese: "chuyến thăm", definition_en: "An act of going to see someone or something.", definition_vi: "Hành động đi gặp ai đó hoặc cái gì đó.", example: { de: "Der Besuch war kurz.", en: "The visit was short.", vi: "Chuyến thăm ngắn." } },
    { word: "Bett", artikel: "das", plural: "Betten", english: "bed", vietnamese: "giường", definition_en: "A piece of furniture for sleeping.", definition_vi: "Một món đồ nội thất để ngủ.", example: { de: "Das Bett ist bequem.", en: "The bed is comfortable.", vi: "Giường thoải mái." } },
    { word: "Bewegung", artikel: "die", plural: "Bewegungen", english: "movement", vietnamese: "chuyển động", definition_en: "The act of moving.", definition_vi: "Hành động di chuyển.", example: { de: "Die Bewegung ist wichtig.", en: "Movement is important.", vi: "Chuyển động quan trọng." } },
    { word: "Bibliothek", artikel: "die", plural: "Bibliotheken", english: "library", vietnamese: "thư viện", definition_en: "A building with books for reading or borrowing.", definition_vi: "Một tòa nhà có sách để đọc hoặc mượn.", example: { de: "Die Bibliothek ist groß.", en: "The library is big.", vi: "Thư viện lớn." } },
    { word: "Bier", artikel: "das", plural: "Biere", english: "beer", vietnamese: "bia", definition_en: "An alcoholic drink made from grain.", definition_vi: "Đồ uống có cồn làm từ ngũ cốc.", example: { de: "Das Bier ist kalt.", en: "The beer is cold.", vi: "Bia lạnh." } },
    { word: "Bildschirm", artikel: "der", plural: "Bildschirme", english: "screen", vietnamese: "màn hình", definition_en: "A surface for displaying images.", definition_vi: "Một bề mặt để hiển thị hình ảnh.", example: { de: "Der Bildschirm ist groß.", en: "The screen is big.", vi: "Màn hình lớn." } },
    { word: "Birne", artikel: "die", plural: "Birnen", english: "pear", vietnamese: "quả lê", definition_en: "A sweet fruit with a narrow top.", definition_vi: "Một loại trái cây ngọt có đỉnh hẹp.", example: { de: "Die Birne ist süß.", en: "The pear is sweet.", vi: "Quả lê ngọt." } },
    { word: "Blatt", artikel: "das", plural: "Blätter", english: "leaf", vietnamese: "lá", definition_en: "A flat green part of a plant.", definition_vi: "Một phần phẳng màu xanh của cây.", example: { de: "Das Blatt ist grün.", en: "The leaf is green.", vi: "Lá xanh." } },
    { word: "Bleistift", artikel: "der", plural: "Bleistifte", english: "pencil", vietnamese: "bút chì", definition_en: "A writing instrument with graphite.", definition_vi: "Một dụng cụ viết có than chì.", example: { de: "Der Bleistift ist spitz.", en: "The pencil is sharp.", vi: "Bút chì nhọn." } },
    { word: "Blitz", artikel: "der", plural: "Blitze", english: "lightning", vietnamese: "tia chớp", definition_en: "A bright flash in the sky during a storm.", definition_vi: "Một tia sáng trên bầu trời trong cơn bão.", example: { de: "Der Blitz ist hell.", en: "The lightning is bright.", vi: "Tia chớp sáng." } },
    { word: "Boot", artikel: "das", plural: "Boote", english: "boat", vietnamese: "thuyền", definition_en: "A small vessel for traveling on water.", definition_vi: "Một phương tiện nhỏ để đi trên nước.", example: { de: "Das Boot ist klein.", en: "The boat is small.", vi: "Thuyền nhỏ." } },
    { word: "Box", artikel: "die", plural: "Boxen", english: "speaker", vietnamese: "loa", definition_en: "A device that produces sound.", definition_vi: "Một thiết bị tạo ra âm thanh.", example: { de: "Die Box ist laut.", en: "The speaker is loud.", vi: "Loa to." } },
    { word: "Brand", artikel: "der", plural: "Brände", english: "fire", vietnamese: "đám cháy", definition_en: "A destructive burning.", definition_vi: "Một vụ cháy phá hủy.", example: { de: "Der Brand ist gefährlich.", en: "The fire is dangerous.", vi: "Đám cháy nguy hiểm." } },
    { word: "Braut", artikel: "die", plural: "Bräute", english: "bride", vietnamese: "cô dâu", definition_en: "A woman on her wedding day.", definition_vi: "Một phụ nữ trong ngày cưới của mình.", example: { de: "Die Braut ist schön.", en: "The bride is beautiful.", vi: "Cô dâu đẹp." } },
    { word: "Bräutigam", artikel: "der", plural: "Bräutigame", english: "groom", vietnamese: "chú rể", definition_en: "A man on his wedding day.", definition_vi: "Một người đàn ông trong ngày cưới của mình.", example: { de: "Der Bräutigam ist nervös.", en: "The groom is nervous.", vi: "Chú rể hồi hộp." } },
    { word: "Brücke", artikel: "die", plural: "Brücken", english: "bridge", vietnamese: "cầu", definition_en: "A structure that crosses a river or road.", definition_vi: "Một công trình băng qua sông hoặc đường.", example: { de: "Die Brücke ist lang.", en: "The bridge is long.", vi: "Cầu dài." } },
    { word: "Brunnen", artikel: "der", plural: "Brunnen", english: "fountain", vietnamese: "đài phun nước", definition_en: "A structure from which water flows.", definition_vi: "Một công trình mà nước chảy ra.", example: { de: "Der Brunnen ist alt.", en: "The fountain is old.", vi: "Đài phun nước cũ." } },
    { word: "Brust", artikel: "die", plural: "Brüste", english: "chest", vietnamese: "ngực", definition_en: "The front part of the body.", definition_vi: "Phần phía trước của cơ thể.", example: { de: "Die Brust tut weh.", en: "The chest hurts.", vi: "Ngực đau." } },
    { word: "Bürger", artikel: "der", plural: "Bürger", english: "citizen", vietnamese: "công dân", definition_en: "A person who belongs to a country.", definition_vi: "Một người thuộc về một quốc gia.", example: { de: "Er ist deutscher Bürger.", en: "He is a German citizen.", vi: "Anh ấy là công dân Đức." } },
    { word: "Büro", artikel: "das", plural: "Büros", english: "office", vietnamese: "văn phòng", definition_en: "A room or building where people work.", definition_vi: "Một phòng hoặc tòa nhà nơi mọi người làm việc.", example: { de: "Das Büro ist groß.", en: "The office is big.", vi: "Văn phòng lớn." } },
    { word: "Butter", artikel: "die", plural: "-", english: "butter", vietnamese: "bơ", definition_en: "A yellow fat made from milk.", definition_vi: "Một chất béo màu vàng làm từ sữa.", example: { de: "Die Butter ist frisch.", en: "The butter is fresh.", vi: "Bơ tươi." } }
  ],
  // Add more letters with comprehensive coverage...
};

// Read existing letter file or create new structure
function loadOrCreateLetterFile(letter) {
  const filepath = path.join(lettersDir, `${letter}.json`);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  return {
    byWord: {},
    byEnglish: {},
    byVietnamese: {},
    byArtikel: { der: [], die: [], das: [] },
    entries: {}
  };
}

// Add nouns to a letter file
function addNounsToLetter(letter, nouns) {
  const data = loadOrCreateLetterFile(letter);
  
  nouns.forEach(noun => {
    const id = generateId();
    const wordLower = noun.word.toLowerCase();
    
    // Add to indexes
    data.byWord[wordLower] = id;
    
    if (!data.byEnglish[noun.english]) {
      data.byEnglish[noun.english] = [];
    }
    data.byEnglish[noun.english].push(id);
    
    if (!data.byVietnamese[noun.vietnamese]) {
      data.byVietnamese[noun.vietnamese] = [];
    }
    data.byVietnamese[noun.vietnamese].push(id);
    
    data.byArtikel[noun.artikel].push(id);
    
    // Add full entry
    data.entries[id] = {
      word: noun.word,
      artikel: noun.artikel,
      plural: noun.plural,
      english: noun.english,
      vietnamese: noun.vietnamese,
      definition_en: noun.definition_en,
      definition_vi: noun.definition_vi,
      examples: [noun.example]
    };
  });
  
  return data;
}

// Process all letters
function expandDictionary() {
  Object.entries(nounsData).forEach(([letter, nouns]) => {
    if (nouns.length > 0) {
      console.log(`Expanding letter ${letter.toUpperCase()} with ${nouns.length} new nouns...`);
      const data = addNounsToLetter(letter, nouns);
      const filepath = path.join(lettersDir, `${letter}.json`);
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Saved ${letter}.json`);
    }
  });
  
  console.log(`\nExpansion complete! Current highest ID: ID${currentId - 1}`);
}

// Run expansion
expandDictionary();
