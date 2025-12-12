#!/usr/bin/env node

/**
 * Massive Dictionary Expansion Script
 * 
 * This script systematically expands the German noun dictionary to maximum coverage
 * Target: 2,000-3,000+ A1-B2+ level nouns
 */

const fs = require('fs');
const path = require('path');

// Comprehensive German noun database organized by letter
// Each entry: [word, artikel, plural, english, vietnamese, definition_en, definition_vi, example_de, example_en, example_vi]

const expansionData = {
  d: [
    ['Deckel', 'der', 'Deckel', 'lid', 'nắp', 'A cover for a container.', 'Nắp đậy cho hộp đựng.', 'Der Deckel ist fest.', 'The lid is tight.', 'Nắp chặt.'],
    ['Demokratie', 'die', 'Demokratien', 'democracy', 'dân chủ', 'A system of government by the whole population.', 'Hệ thống chính phủ của toàn dân.', 'Die Demokratie ist wichtig.', 'Democracy is important.', 'Dân chủ quan trọng.'],
    ['Denkmal', 'das', 'Denkmäler', 'monument', 'đài tưởng niệm', 'A structure erected to commemorate.', 'Công trình tưởng niệm.', 'Das Denkmal ist alt.', 'The monument is old.', 'Đài tưởng niệm cũ.'],
    ['Detail', 'das', 'Details', 'detail', 'chi tiết', 'A small individual fact or item.', 'Một sự kiện hoặc mục nhỏ riêng lẻ.', 'Das Detail ist wichtig.', 'The detail is important.', 'Chi tiết quan trọng.'],
    ['Dezember', 'der', '-', 'December', 'tháng Mười Hai', 'The twelfth month of the year.', 'Tháng thứ mười hai trong năm.', 'Im Dezember ist Weihnachten.', 'Christmas is in December.', 'Giáng sinh vào tháng Mười Hai.'],
    ['Dialekt', 'der', 'Dialekte', 'dialect', 'phương ngữ', 'A particular form of a language.', 'Một dạng đặc biệt của ngôn ngữ.', 'Der Dialekt ist interessant.', 'The dialect is interesting.', 'Phương ngữ thú vị.'],
    ['Diamant', 'der', 'Diamanten', 'diamond', 'kim cương', 'A precious stone.', 'Đá quý.', 'Der Diamant glänzt.', 'The diamond shines.', 'Kim cương lấp lánh.'],
    ['Dichter', 'der', 'Dichter', 'poet', 'nhà thơ', 'A person who writes poems.', 'Người viết thơ.', 'Der Dichter ist berühmt.', 'The poet is famous.', 'Nhà thơ nổi tiếng.'],
    ['Dieb', 'der', 'Diebe', 'thief', 'kẻ trộm', 'A person who steals.', 'Người ăn trộm.', 'Der Dieb wurde gefasst.', 'The thief was caught.', 'Kẻ trộm bị bắt.'],
    ['Dienst', 'der', 'Dienste', 'service', 'dịch vụ', 'Work done for others.', 'Công việc được thực hiện cho người khác.', 'Der Dienst ist gut.', 'The service is good.', 'Dịch vụ tốt.'],
    ['Dienstleistung', 'die', 'Dienstleistungen', 'service', 'dịch vụ', 'An act of helpful activity.', 'Một hành động hữu ích.', 'Die Dienstleistung ist teuer.', 'The service is expensive.', 'Dịch vụ đắt.'],
    ['Diplom', 'das', 'Diplome', 'diploma', 'bằng cấp', 'A certificate of completion.', 'Giấy chứng nhận hoàn thành.', 'Das Diplom ist wichtig.', 'The diploma is important.', 'Bằng cấp quan trọng.'],
    ['Diskussion', 'die', 'Diskussionen', 'discussion', 'thảo luận', 'A conversation about a topic.', 'Cuộc trò chuyện về một chủ đề.', 'Die Diskussion ist lang.', 'The discussion is long.', 'Cuộc thảo luận dài.'],
    ['Dokument', 'das', 'Dokumente', 'document', 'tài liệu', 'A piece of written information.', 'Một mảnh thông tin bằng văn bản.', 'Das Dokument ist offiziell.', 'The document is official.', 'Tài liệu chính thức.'],
    ['Dollar', 'der', 'Dollar', 'dollar', 'đô la', 'The currency of the USA.', 'Tiền tệ của Mỹ.', 'Der Dollar ist stark.', 'The dollar is strong.', 'Đô la mạnh.'],
    ['Dom', 'der', 'Dome', 'cathedral', 'nhà thờ lớn', 'A large important church.', 'Một nhà thờ lớn quan trọng.', 'Der Dom ist schön.', 'The cathedral is beautiful.', 'Nhà thờ lớn đẹp.'],
    ['Donner', 'der', '-', 'thunder', 'sấm', 'The sound from lightning.', 'Âm thanh từ sấm sét.', 'Der Donner ist laut.', 'The thunder is loud.', 'Sấm to.'],
    ['Doppel', 'das', 'Doppel', 'double', 'đôi', 'Something consisting of two parts.', 'Cái gì đó gồm hai phần.', 'Das Doppel gewinnt.', 'The double wins.', 'Đôi thắng.'],
    ['Drama', 'das', 'Dramen', 'drama', 'kịch', 'A play for theater or television.', 'Vở kịch cho nhà hát hoặc truyền hình.', 'Das Drama ist spannend.', 'The drama is exciting.', 'Vở kịch hấp dẫn.'],
    ['Droge', 'die', 'Drogen', 'drug', 'ma túy', 'An illegal substance.', 'Chất bất hợp pháp.', 'Drogen sind gefährlich.', 'Drugs are dangerous.', 'Ma túy nguy hiểm.'],
    ['Druck', 'der', 'Drücke', 'pressure', 'áp lực', 'Force applied to something.', 'Lực tác động lên cái gì đó.', 'Der Druck ist hoch.', 'The pressure is high.', 'Áp lực cao.'],
    ['Drucker', 'der', 'Drucker', 'printer', 'máy in', 'A machine that prints.', 'Máy in.', 'Der Drucker funktioniert.', 'The printer works.', 'Máy in hoạt động.'],
    ['Dschungel', 'der', 'Dschungel', 'jungle', 'rừng rậm', 'Dense tropical forest.', 'Rừng nhiệt đới rậm rạp.', 'Der Dschungel ist grün.', 'The jungle is green.', 'Rừng rậm xanh.'],
    ['Duft', 'der', 'Düfte', 'scent', 'hương thơm', 'A pleasant smell.', 'Mùi thơm dễ chịu.', 'Der Duft ist angenehm.', 'The scent is pleasant.', 'Hương thơm dễ chịu.'],
    ['Dunkelheit', 'die', '-', 'darkness', 'bóng tối', 'The absence of light.', 'Sự vắng mặt của ánh sáng.', 'Die Dunkelheit ist gruselig.', 'The darkness is scary.', 'Bóng tối đáng sợ.'],
    ['Durst', 'der', '-', 'thirst', 'khát', 'The feeling of needing to drink.', 'Cảm giác cần uống.', 'Der Durst ist groß.', 'The thirst is great.', 'Khát nhiều.'],
    ['DVD', 'die', 'DVDs', 'DVD', 'đĩa DVD', 'Digital video disc.', 'Đĩa video kỹ thuật số.', 'Die DVD ist neu.', 'The DVD is new.', 'Đĩa DVD mới.'],
    ['Dampf', 'der', 'Dämpfe', 'steam', 'hơi nước', 'Water vapor.', 'Hơi nước.', 'Der Dampf steigt auf.', 'The steam rises.', 'Hơi nước bốc lên.'],
    ['Datei', 'die', 'Dateien', 'file', 'tệp tin', 'A computer file.', 'Tệp tin máy tính.', 'Die Datei ist groß.', 'The file is large.', 'Tệp tin lớn.'],
    ['Datum', 'das', 'Daten', 'date', 'ngày tháng', 'A day of the year.', 'Một ngày trong năm.', 'Das Datum ist wichtig.', 'The date is important.', 'Ngày tháng quan trọng.'],
    ['Dauer', 'die', '-', 'duration', 'thời gian', 'The time something lasts.', 'Thời gian cái gì đó kéo dài.', 'Die Dauer ist kurz.', 'The duration is short.', 'Thời gian ngắn.'],
    ['Deck', 'das', 'Decks', 'deck', 'boong tàu', 'A platform on a ship.', 'Sàn trên tàu.', 'Das Deck ist nass.', 'The deck is wet.', 'Boong tàu ướt.']
  ],
  
  e: [
    ['Ecke', 'die', 'Ecken', 'corner', 'góc', 'A place where two sides meet.', 'Nơi hai bên gặp nhau.', 'Die Ecke ist dunkel.', 'The corner is dark.', 'Góc tối.'],
    ['Ehre', 'die', '-', 'honor', 'danh dự', 'High respect or reputation.', 'Sự tôn trọng hoặc danh tiếng cao.', 'Die Ehre ist wichtig.', 'Honor is important.', 'Danh dự quan trọng.'],
    ['Ei', 'das', 'Eier', 'egg', 'trứng', 'An oval object laid by birds.', 'Vật hình trứng do chim đẻ.', 'Das Ei ist frisch.', 'The egg is fresh.', 'Trứng tươi.'],
    ['Einkommen', 'das', 'Einkommen', 'income', 'thu nhập', 'Money received.', 'Tiền nhận được.', 'Das Einkommen ist hoch.', 'The income is high.', 'Thu nhập cao.'],
    ['Einladung', 'die', 'Einladungen', 'invitation', 'lời mời', 'A request to attend.', 'Yêu cầu tham dự.', 'Die Einladung ist schön.', 'The invitation is nice.', 'Lời mời đẹp.'],
    ['Einwohner', 'der', 'Einwohner', 'inhabitant', 'cư dân', 'A person who lives in a place.', 'Người sống ở một nơi.', 'Der Einwohner ist freundlich.', 'The inhabitant is friendly.', 'Cư dân thân thiện.'],
    ['Element', 'das', 'Elemente', 'element', 'yếu tố', 'A basic part.', 'Một phần cơ bản.', 'Das Element ist wichtig.', 'The element is important.', 'Yếu tố quan trọng.'],
    ['Eltern', 'die', '-', 'parents', 'cha mẹ', 'Father and mother.', 'Cha và mẹ.', 'Die Eltern sind stolz.', 'The parents are proud.', 'Cha mẹ tự hào.'],
    ['Ende', 'das', 'Enden', 'end', 'kết thúc', 'The final part.', 'Phần cuối cùng.', 'Das Ende ist nah.', 'The end is near.', 'Kết thúc gần.'],
    ['Energie', 'die', 'Energien', 'energy', 'năng lượng', 'Power from resources.', 'Sức mạnh từ tài nguyên.', 'Die Energie ist sauber.', 'The energy is clean.', 'Năng lượng sạch.'],
    ['Engel', 'der', 'Engel', 'angel', 'thiên thần', 'A spiritual being.', 'Một sinh vật tâm linh.', 'Der Engel ist schön.', 'The angel is beautiful.', 'Thiên thần đẹp.'],
    ['Enkel', 'der', 'Enkel', 'grandson', 'cháu trai', 'Son of one\'s child.', 'Con trai của con mình.', 'Der Enkel ist klein.', 'The grandson is small.', 'Cháu trai nhỏ.'],
    ['Entfernung', 'die', 'Entfernungen', 'distance', 'khoảng cách', 'The space between two points.', 'Không gian giữa hai điểm.', 'Die Entfernung ist groß.', 'The distance is great.', 'Khoảng cách lớn.'],
    ['Entwicklung', 'die', 'Entwicklungen', 'development', 'phát triển', 'The process of growing.', 'Quá trình phát triển.', 'Die Entwicklung ist schnell.', 'The development is fast.', 'Phát triển nhanh.'],
    ['Erde', 'die', '-', 'earth', 'trái đất', 'The planet we live on.', 'Hành tinh chúng ta sống.', 'Die Erde ist rund.', 'The earth is round.', 'Trái đất tròn.'],
    ['Erdgeschoss', 'das', 'Erdgeschosse', 'ground floor', 'tầng trệt', 'The floor at ground level.', 'Tầng ở mức mặt đất.', 'Das Erdgeschoss ist groß.', 'The ground floor is large.', 'Tầng trệt lớn.'],
    ['Erfolg', 'der', 'Erfolge', 'success', 'thành công', 'Achievement of a goal.', 'Đạt được mục tiêu.', 'Der Erfolg ist sicher.', 'Success is certain.', 'Thành công chắc chắn.'],
    ['Ergebnis', 'das', 'Ergebnisse', 'result', 'kết quả', 'The outcome.', 'Kết quả.', 'Das Ergebnis ist gut.', 'The result is good.', 'Kết quả tốt.'],
    ['Erklärung', 'die', 'Erklärungen', 'explanation', 'giải thích', 'A statement that makes clear.', 'Tuyên bố làm rõ.', 'Die Erklärung ist klar.', 'The explanation is clear.', 'Giải thích rõ ràng.'],
    ['Erlaubnis', 'die', 'Erlaubnisse', 'permission', 'sự cho phép', 'Authorization to do something.', 'Ủy quyền để làm gì đó.', 'Die Erlaubnis ist nötig.', 'Permission is necessary.', 'Sự cho phép cần thiết.'],
    ['Ernst', 'der', '-', 'seriousness', 'sự nghiêm túc', 'Being serious.', 'Trở nên nghiêm túc.', 'Der Ernst ist wichtig.', 'Seriousness is important.', 'Sự nghiêm túc quan trọng.'],
    ['Erwachsene', 'der/die', 'Erwachsenen', 'adult', 'người lớn', 'A fully grown person.', 'Một người trưởng thành đầy đủ.', 'Der Erwachsene arbeitet.', 'The adult works.', 'Người lớn làm việc.'],
    ['Esel', 'der', 'Esel', 'donkey', 'con lừa', 'A domesticated animal.', 'Động vật được thuần hóa.', 'Der Esel ist stark.', 'The donkey is strong.', 'Con lừa mạnh.'],
    ['Essen', 'das', '-', 'food', 'thức ăn', 'Substance consumed for nutrition.', 'Chất được tiêu thụ để dinh dưỡng.', 'Das Essen schmeckt gut.', 'The food tastes good.', 'Thức ăn ngon.'],
    ['Euro', 'der', 'Euro', 'euro', 'đồng euro', 'European currency.', 'Tiền tệ châu Âu.', 'Der Euro ist stark.', 'The euro is strong.', 'Đồng euro mạnh.'],
    ['Export', 'der', 'Exporte', 'export', 'xuất khẩu', 'Goods sent to another country.', 'Hàng hóa gửi đến quốc gia khác.', 'Der Export steigt.', 'Exports are rising.', 'Xuất khẩu tăng.'],
    ['Experiment', 'das', 'Experimente', 'experiment', 'thí nghiệm', 'A scientific procedure.', 'Một thủ tục khoa học.', 'Das Experiment gelingt.', 'The experiment succeeds.', 'Thí nghiệm thành công.']
  ],
  
  f: [
    ['Fabrik', 'die', 'Fabriken', 'factory', 'nhà máy', 'A building where goods are manufactured.', 'Tòa nhà sản xuất hàng hóa.', 'Die Fabrik ist groß.', 'The factory is large.', 'Nhà máy lớn.'],
    ['Fach', 'das', 'Fächer', 'subject', 'môn học', 'An area of study.', 'Một lĩnh vực nghiên cứu.', 'Das Fach ist interessant.', 'The subject is interesting.', 'Môn học thú vị.'],
    ['Faden', 'der', 'Fäden', 'thread', 'sợi chỉ', 'A long thin strand.', 'Một sợi dài và mỏng.', 'Der Faden ist dünn.', 'The thread is thin.', 'Sợi chỉ mỏng.'],
    ['Fahne', 'die', 'Fahnen', 'flag', 'lá cờ', 'A piece of cloth used as a symbol.', 'Một mảnh vải dùng làm biểu tượng.', 'Die Fahne weht.', 'The flag waves.', 'Lá cờ tung bay.'],
    ['Fahrkarte', 'die', 'Fahrkarten', 'ticket', 'vé', 'A document allowing travel.', 'Tài liệu cho phép đi lại.', 'Die Fahrkarte ist teuer.', 'The ticket is expensive.', 'Vé đắt.'],
    ['Fahrplan', 'der', 'Fahrpläne', 'timetable', 'thời gian biểu', 'A schedule of departures and arrivals.', 'Lịch trình khởi hành và đến.', 'Der Fahrplan ist aktuell.', 'The timetable is current.', 'Thời gian biểu hiện tại.'],
    ['Fähre', 'die', 'Fähren', 'ferry', 'phà', 'A boat for transporting.', 'Tàu để vận chuyển.', 'Die Fähre fährt ab.', 'The ferry departs.', 'Phà khởi hành.'],
    ['Fähigkeit', 'die', 'Fähigkeiten', 'ability', 'khả năng', 'The power to do something.', 'Sức mạnh để làm điều gì đó.', 'Die Fähigkeit ist wichtig.', 'The ability is important.', 'Khả năng quan trọng.'],
    ['Fall', 'der', 'Fälle', 'case', 'trường hợp', 'An instance or situation.', 'Một ví dụ hoặc tình huống.', 'Der Fall ist schwer.', 'The case is difficult.', 'Trường hợp khó.'],
    ['Fantasie', 'die', 'Fantasien', 'fantasy', 'tưởng tượng', 'The faculty of imagination.', 'Khả năng tưởng tượng.', 'Die Fantasie ist reich.', 'The fantasy is rich.', 'Tưởng tượng phong phú.'],
    ['Fass', 'das', 'Fässer', 'barrel', 'thùng', 'A large container.', 'Một thùng chứa lớn.', 'Das Fass ist voll.', 'The barrel is full.', 'Thùng đầy.'],
    ['Faust', 'die', 'Fäuste', 'fist', 'nắm đấm', 'A tightly closed hand.', 'Bàn tay nắm chặt.', 'Die Faust ist stark.', 'The fist is strong.', 'Nắm đấm mạnh.'],
    ['Fehler', 'der', 'Fehler', 'mistake', 'lỗi', 'Something incorrect.', 'Điều gì đó không đúng.', 'Der Fehler ist klein.', 'The mistake is small.', 'Lỗi nhỏ.'],
    ['Feld', 'das', 'Felder', 'field', 'cánh đồng', 'An area of open land.', 'Một khu vực đất trống.', 'Das Feld ist grün.', 'The field is green.', 'Cánh đồng xanh.'],
    ['Fell', 'das', 'Felle', 'fur', 'bộ lông', 'The hairy coat of an animal.', 'Bộ lông của động vật.', 'Das Fell ist weich.', 'The fur is soft.', 'Bộ lông mềm.'],
    ['Ferien', 'die', '-', 'vacation', 'kỳ nghỉ', 'A period of rest from work.', 'Thời kỳ nghỉ ngơi không làm việc.', 'Die Ferien sind schön.', 'The vacation is nice.', 'Kỳ nghỉ đẹp.'],
    ['Fest', 'das', 'Feste', 'festival', 'lễ hội', 'A celebration.', 'Một lễ kỷ niệm.', 'Das Fest ist fröhlich.', 'The festival is cheerful.', 'Lễ hội vui vẻ.'],
    ['Feuer', 'das', 'Feuer', 'fire', 'lửa', 'Combustion producing heat and light.', 'Sự cháy tạo ra nhiệt và ánh sáng.', 'Das Feuer brennt.', 'The fire burns.', 'Lửa cháy.'],
    ['Fieber', 'das', '-', 'fever', 'sốt', 'High body temperature.', 'Nhiệt độ cơ thể cao.', 'Das Fieber ist hoch.', 'The fever is high.', 'Sốt cao.'],
    ['Film', 'der', 'Filme', 'film', 'phim', 'A motion picture.', 'Một bức tranh chuyển động.', 'Der Film ist spannend.', 'The film is exciting.', 'Phim hấp dẫn.'],
    ['Firma', 'die', 'Firmen', 'company', 'công ty', 'A business organization.', 'Một tổ chức kinh doanh.', 'Die Firma ist groß.', 'The company is large.', 'Công ty lớn.'],
    ['Flasche', 'die', 'Flaschen', 'bottle', 'chai', 'A container for liquids.', 'Một thùng chứa chất lỏng.', 'Die Flasche ist leer.', 'The bottle is empty.', 'Chai rỗng.'],
    ['Fleisch', 'das', '-', 'meat', 'thịt', 'Animal flesh as food.', 'Thịt động vật làm thức ăn.', 'Das Fleisch ist frisch.', 'The meat is fresh.', 'Thịt tươi.'],
    ['Fluss', 'der', 'Flüsse', 'river', 'sông', 'A large natural stream.', 'Dòng chảy tự nhiên lớn.', 'Der Fluss ist breit.', 'The river is wide.', 'Sông rộng.'],
    ['Form', 'die', 'Formen', 'form', 'hình dạng', 'The shape of something.', 'Hình dạng của cái gì đó.', 'Die Form ist rund.', 'The form is round.', 'Hình dạng tròn.'],
    ['Foto', 'das', 'Fotos', 'photo', 'ảnh', 'A photograph.', 'Một bức ảnh.', 'Das Foto ist schön.', 'The photo is beautiful.', 'Ảnh đẹp.'],
    ['Freiheit', 'die', 'Freiheiten', 'freedom', 'tự do', 'The power to act freely.', 'Sức mạnh để hành động tự do.', 'Die Freiheit ist wichtig.', 'Freedom is important.', 'Tự do quan trọng.'],
    ['Friede', 'der', '-', 'peace', 'hòa bình', 'Freedom from war.', 'Tự do khỏi chiến tranh.', 'Der Friede ist kostbar.', 'Peace is precious.', 'Hòa bình quý giá.'],
    ['Frost', 'der', 'Fröste', 'frost', 'sương giá', 'Ice crystals forming on surfaces.', 'Tinh thể băng hình thành trên bề mặt.', 'Der Frost ist kalt.', 'The frost is cold.', 'Sương giá lạnh.'],
    ['Frucht', 'die', 'Früchte', 'fruit', 'trái cây', 'The edible product of a plant.', 'Sản phẩm ăn được của thực vật.', 'Die Frucht ist süß.', 'The fruit is sweet.', 'Trái cây ngọt.'],
    ['Fuchs', 'der', 'Füchse', 'fox', 'con cáo', 'A wild animal.', 'Động vật hoang dã.', 'Der Fuchs ist schlau.', 'The fox is clever.', 'Con cáo khôn ngoan.'],
    ['Fußball', 'der', 'Fußbälle', 'football', 'bóng đá', 'A popular sport.', 'Môn thể thao phổ biến.', 'Der Fußball ist rund.', 'The football is round.', 'Bóng đá tròn.']
  ]
};

// Load current dictionary letter file
function loadLetterFile(letter) {
  const filePath = path.join(__dirname, '..', 'public', 'data', 'dictionary', 'letters', `${letter}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return {
    byWord: {},
    byEnglish: {},
    byVietnamese: {},
    byArtikel: { der: [], die: [], das: [] },
    entries: {}
  };
}

// Find next available ID
function getNextId(allLetterFiles) {
  let maxId = 0;
  allLetterFiles.forEach(letter => {
    const data = loadLetterFile(letter);
    Object.keys(data.entries).forEach(id => {
      const num = parseInt(id.replace('ID', ''));
      if (num > maxId) maxId = num;
    });
  });
  return maxId + 1;
}

// Generate expanded dictionary for a letter
function expandLetter(letter, newData, startId) {
  const dict = loadLetterFile(letter);
  let currentId = startId;
  
  newData.forEach(([word, artikel, plural, english, vietnamese, def_en, def_vi, ex_de, ex_en, ex_vi]) => {
    const id = `ID${String(currentId).padStart(3, '0')}`;
    const wordLower = word.toLowerCase();
    
    // Add to indexes
    dict.byWord[wordLower] = id;
    
    if (!dict.byEnglish[english]) dict.byEnglish[english] = [];
    if (!dict.byEnglish[english].includes(id)) dict.byEnglish[english].push(id);
    
    if (!dict.byVietnamese[vietnamese]) dict.byVietnamese[vietnamese] = [];
    if (!dict.byVietnamese[vietnamese].includes(id)) dict.byVietnamese[vietnamese].push(id);
    
    if (!dict.byArtikel[artikel]) dict.byArtikel[artikel] = [];
    if (!dict.byArtikel[artikel].includes(id)) dict.byArtikel[artikel].push(id);
    
    // Add entry
    dict.entries[id] = {
      word,
      artikel,
      plural,
      english,
      vietnamese,
      definition_en: def_en,
      definition_vi: def_vi,
      examples: [{
        de: ex_de,
        en: ex_en,
        vi: ex_vi
      }]
    };
    
    currentId++;
  });
  
  return { dict, nextId: currentId };
}

// Save dictionary file
function saveDictionary(letter, dict) {
  const filePath = path.join(__dirname, '..', 'public', 'data', 'dictionary', 'letters', `${letter}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`✓ Saved ${letter}.json with ${Object.keys(dict.entries).length} entries`);
}

// Main execution
console.log('Starting massive dictionary expansion...\n');

const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'ö', 'ü'];
let nextId = getNextId(allLetters);

console.log(`Starting from ID: ID${String(nextId).padStart(3, '0')}\n`);

// Expand letters with new data
Object.keys(expansionData).forEach(letter => {
  console.log(`Expanding letter ${letter.toUpperCase()}...`);
  const result = expandLetter(letter, expansionData[letter], nextId);
  saveDictionary(letter, result.dict);
  nextId = result.nextId;
});

console.log(`\n✓ Expansion complete! Next ID: ID${String(nextId).padStart(3, '0')}`);
console.log(`Total new entries added: ${Object.keys(expansionData).reduce((sum, letter) => sum + expansionData[letter].length, 0)}`);
