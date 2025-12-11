#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 2 Dictionary Expansion: Letters G, H, I, J, K
Adds comprehensive A1-B2+ level German nouns
"""

import json
import os

# Starting ID
next_id = 550

def create_entry(word, artikel, plural, english, vietnamese, definition_en, definition_vi, example_de, example_en, example_vi):
    global next_id
    entry_id = f"ID{str(next_id).zfill(3)}"
    next_id += 1
    
    return entry_id, {
        "word": word,
        "artikel": artikel,
        "plural": plural,
        "english": english,
        "vietnamese": vietnamese,
        "definition_en": definition_en,
        "definition_vi": definition_vi,
        "examples": [{
            "de": example_de,
            "en": example_en,
            "vi": example_vi
        }]
    }

# Letter G expansions (42 new entries)
g_new_entries = [
    ("Gabel", "die", "Gabeln", "fork", "cái nĩa", "A utensil with prongs for eating.", "Dụng cụ có răng để ăn.", "Ich esse mit einer Gabel.", "I eat with a fork.", "Tôi ăn bằng cái nĩa."),
    ("Garage", "die", "Garagen", "garage", "nhà để xe", "A building for parking vehicles.", "Tòa nhà để đậu xe.", "Das Auto steht in der Garage.", "The car is in the garage.", "Xe ô tô ở trong nhà để xe."),
    ("Gast", "der", "Gäste", "guest", "khách", "A person who visits.", "Người đến thăm.", "Der Gast kommt um 18 Uhr.", "The guest comes at 6 PM.", "Khách đến lúc 6 giờ tối."),
    ("Gebäude", "das", "Gebäude", "building", "tòa nhà", "A structure with walls and a roof.", "Cấu trúc có tường và mái.", "Das Gebäude ist sehr alt.", "The building is very old.", "Tòa nhà rất cũ."),
    ("Gebirge", "das", "Gebirge", "mountain range", "dãy núi", "A series of connected mountains.", "Một chuỗi núi liên kết.", "Die Alpen sind ein großes Gebirge.", "The Alps are a large mountain range.", "Alps là một dãy núi lớn."),
    ("Geburt", "die", "Geburten", "birth", "sự sinh", "The process of being born.", "Quá trình được sinh ra.", "Die Geburt war gestern.", "The birth was yesterday.", "Sự sinh diễn ra hôm qua."),
    ("Gedanke", "der", "Gedanken", "thought", "suy nghĩ", "An idea or opinion.", "Một ý tưởng hoặc quan điểm.", "Der Gedanke ist gut.", "The thought is good.", "Suy nghĩ tốt đấy."),
    ("Gedicht", "das", "Gedichte", "poem", "bài thơ", "A piece of writing in verse.", "Một tác phẩm viết theo thể thơ.", "Das Gedicht ist schön.", "The poem is beautiful.", "Bài thơ đẹp quá."),
    ("Gefahr", "die", "Gefahren", "danger", "nguy hiểm", "A situation involving risk.", "Tình huống có rủi ro.", "Es gibt eine Gefahr.", "There is a danger.", "Có một mối nguy hiểm."),
    ("Gefühl", "das", "Gefühle", "feeling", "cảm giác", "An emotional state.", "Một trạng thái cảm xúc.", "Das Gefühl ist stark.", "The feeling is strong.", "Cảm giác mạnh mẽ."),
    ("Gegend", "die", "Gegenden", "area", "vùng", "A region or district.", "Một khu vực hoặc vùng.", "Die Gegend ist schön.", "The area is beautiful.", "Vùng này đẹp."),
    ("Gegenteil", "das", "Gegenteile", "opposite", "ngược lại", "Something completely different.", "Thứ gì đó hoàn toàn khác.", "Das Gegenteil ist wahr.", "The opposite is true.", "Điều ngược lại mới đúng."),
    ("Geheimnis", "das", "Geheimnisse", "secret", "bí mật", "Something kept hidden.", "Điều gì đó được giữ kín.", "Das ist ein Geheimnis.", "That is a secret.", "Đó là một bí mật."),
    ("Gehirn", "das", "Gehirne", "brain", "não", "The organ of thought.", "Cơ quan của tư duy.", "Das Gehirn ist wichtig.", "The brain is important.", "Não rất quan trọng."),
    ("Gemeinde", "die", "Gemeinden", "community", "cộng đồng", "A group of people living together.", "Một nhóm người sống cùng nhau.", "Die Gemeinde ist groß.", "The community is large.", "Cộng đồng lớn."),
    ("Generation", "die", "Generationen", "generation", "thế hệ", "All people born around the same time.", "Tất cả những người sinh cùng thời.", "Die junge Generation.", "The young generation.", "Thế hệ trẻ."),
    ("Gepäck", "das", "-", "luggage", "hành lý", "Bags and cases for travel.", "Túi và va li cho du lịch.", "Das Gepäck ist schwer.", "The luggage is heavy.", "Hành lý nặng."),
    ("Gericht", "das", "Gerichte", "court / dish", "tòa án / món ăn", "A legal institution or a prepared meal.", "Một cơ quan pháp lý hoặc bữa ăn.", "Das Gericht entscheidet.", "The court decides.", "Tòa án quyết định."),
    ("Geruch", "der", "Gerüche", "smell", "mùi", "A scent detected by the nose.", "Mùi hương phát hiện bởi mũi.", "Der Geruch ist stark.", "The smell is strong.", "Mùi rất nặng."),
    ("Geschichte", "die", "Geschichten", "story / history", "câu chuyện / lịch sử", "A narrative or past events.", "Một câu chuyện hoặc sự kiện quá khứ.", "Die Geschichte ist interessant.", "The story is interesting.", "Câu chuyện thú vị."),
    ("Geschwindigkeit", "die", "Geschwindigkeiten", "speed", "tốc độ", "Rate of movement.", "Tốc độ di chuyển.", "Die Geschwindigkeit ist hoch.", "The speed is high.", "Tốc độ cao."),
    ("Geschwister", "die", "-", "siblings", "anh chị em", "Brothers and sisters.", "Anh em trai và chị em gái.", "Ich habe drei Geschwister.", "I have three siblings.", "Tôi có ba anh chị em."),
    ("Gesellschaft", "die", "Gesellschaften", "society", "xã hội", "People living together as a community.", "Mọi người sống cùng nhau như một cộng đồng.", "Die Gesellschaft verändert sich.", "Society is changing.", "Xã hội đang thay đổi."),
    ("Gespräch", "das", "Gespräche", "conversation", "cuộc trò chuyện", "A talk between people.", "Cuộc nói chuyện giữa mọi người.", "Das Gespräch war gut.", "The conversation was good.", "Cuộc trò chuyện tốt."),
    ("Gesundheit", "die", "-", "health", "sức khỏe", "The state of being well.", "Trạng thái khỏe mạnh.", "Die Gesundheit ist wichtig.", "Health is important.", "Sức khỏe quan trọng."),
    ("Getränk", "das", "Getränke", "drink", "đồ uống", "A liquid for drinking.", "Chất lỏng để uống.", "Das Getränk ist kalt.", "The drink is cold.", "Đồ uống lạnh."),
    ("Gewicht", "das", "Gewichte", "weight", "cân nặng", "How heavy something is.", "Mức độ nặng của cái gì.", "Das Gewicht ist 5 kg.", "The weight is 5 kg.", "Cân nặng là 5 kg."),
    ("Gewitter", "das", "Gewitter", "thunderstorm", "giông bão", "A storm with thunder and lightning.", "Một cơn bão có sấm và chớp.", "Das Gewitter kommt.", "The thunderstorm is coming.", "Giông bão đang đến."),
    ("Gewohnheit", "die", "Gewohnheiten", "habit", "thói quen", "A regular practice.", "Một thói quen thường xuyên.", "Die Gewohnheit ist gut.", "The habit is good.", "Thói quen tốt."),
    ("Gift", "das", "Gifte", "poison", "chất độc", "A harmful substance.", "Một chất có hại.", "Das Gift ist gefährlich.", "The poison is dangerous.", "Chất độc nguy hiểm."),
    ("Gipfel", "der", "Gipfel", "peak / summit", "đỉnh", "The top of a mountain.", "Đỉnh của một ngọn núi.", "Der Gipfel ist hoch.", "The peak is high.", "Đỉnh cao."),
    ("Glaube", "der", "-", "belief / faith", "niềm tin", "Confidence in something.", "Sự tin tưởng vào điều gì.", "Der Glaube ist stark.", "The faith is strong.", "Niềm tin mạnh mẽ."),
    ("Gleis", "das", "Gleise", "track / platform", "đường ray", "Railway tracks.", "Đường ray xe lửa.", "Der Zug fährt auf Gleis 3.", "The train runs on track 3.", "Tàu chạy trên đường ray số 3."),
    ("Glocke", "die", "Glocken", "bell", "chuông", "A hollow object that rings.", "Vật rỗng phát ra tiếng chuông.", "Die Glocke läutet.", "The bell rings.", "Chuông reo."),
    ("Gold", "das", "-", "gold", "vàng", "A precious yellow metal.", "Kim loại quý màu vàng.", "Das Gold glänzt.", "The gold shines.", "Vàng lấp lánh."),
    ("Gott", "der", "Götter", "god", "thần", "A supreme being.", "Một sinh vật tối cao.", "An Gott glauben.", "To believe in God.", "Tin vào Chúa."),
    ("Grab", "das", "Gräber", "grave", "mộ", "A place for burial.", "Nơi chôn cất.", "Das Grab ist alt.", "The grave is old.", "Ngôi mộ cũ."),
    ("Grad", "der", "Grade", "degree", "độ", "A unit of measurement.", "Đơn vị đo lường.", "Es sind 20 Grad.", "It is 20 degrees.", "Nhiệt độ 20 độ."),
    ("Grenze", "die", "Grenzen", "border / limit", "biên giới", "A boundary line.", "Đường ranh giới.", "Die Grenze ist hier.", "The border is here.", "Biên giới ở đây."),
    ("Grippe", "die", "-", "flu", "cúm", "A viral infection.", "Một bệnh nhiễm virus.", "Ich habe die Grippe.", "I have the flu.", "Tôi bị cúm."),
    ("Grund", "der", "Gründe", "reason / ground", "lý do", "A cause or basis.", "Một nguyên nhân hoặc cơ sở.", "Der Grund ist klar.", "The reason is clear.", "Lý do rõ ràng."),
    ("Gruß", "der", "Grüße", "greeting", "lời chào", "A polite expression.", "Một biểu hiện lịch sự.", "Viele Grüße!", "Many greetings!", "Lời chào!"),
    ("Gürtel", "der", "Gürtel", "belt", "thắt lưng", "A strap worn around the waist.", "Dây đeo quanh eo.", "Der Gürtel ist neu.", "The belt is new.", "Thắt lưng mới."),
]

# Letter H expansions (34 new entries)
h_new_entries = [
    ("Haar", "das", "Haare", "hair", "tóc", "Strands growing on the head.", "Sợi mọc trên đầu.", "Das Haar ist lang.", "The hair is long.", "Tóc dài."),
    ("Hafen", "der", "Häfen", "harbor / port", "cảng", "A place for ships.", "Nơi cho tàu thuyền.", "Der Hafen ist groß.", "The harbor is large.", "Cảng lớn."),
    ("Hahn", "der", "Hähne", "rooster / tap", "gà trống", "A male chicken.", "Gà trống.", "Der Hahn kräht.", "The rooster crows.", "Gà trống gáy."),
    ("Haken", "der", "Haken", "hook", "móc", "A curved device for hanging.", "Dụng cụ cong để treo.", "Der Haken ist stark.", "The hook is strong.", "Móc chắc."),
    ("Hals", "der", "Hälse", "neck / throat", "cổ", "The part connecting head to body.", "Phần nối đầu với cơ thể.", "Der Hals tut weh.", "The throat hurts.", "Cổ đau."),
    ("Halt", "der", "-", "stop / hold", "dừng", "A cessation of movement.", "Sự ngừng chuyển động.", "Der Bus macht Halt.", "The bus stops.", "Xe buýt dừng lại."),
    ("Hammer", "der", "Hämmer", "hammer", "búa", "A tool for hitting nails.", "Công cụ để đóng đinh.", "Der Hammer ist schwer.", "The hammer is heavy.", "Búa nặng."),
    ("Handel", "der", "-", "trade / commerce", "thương mại", "Buying and selling goods.", "Mua và bán hàng hóa.", "Der Handel wächst.", "Trade is growing.", "Thương mại đang phát triển."),
    ("Handy", "das", "Handys", "mobile phone", "điện thoại di động", "A portable telephone.", "Điện thoại cầm tay.", "Das Handy klingelt.", "The mobile phone is ringing.", "Điện thoại di động đang reo."),
    ("Haushalt", "der", "Haushalte", "household", "hộ gia đình", "A domestic unit.", "Một đơn vị gia đình.", "Der Haushalt ist groß.", "The household is large.", "Hộ gia đình lớn."),
    ("Haut", "die", "Häute", "skin", "da", "The outer covering of the body.", "Lớp bọc ngoài của cơ thể.", "Die Haut ist weich.", "The skin is soft.", "Da mềm mại."),
    ("Heft", "das", "Hefte", "notebook", "vở", "A book for writing.", "Cuốn sách để viết.", "Das Heft ist voll.", "The notebook is full.", "Vở đầy."),
    ("Heimat", "die", "-", "homeland", "quê hương", "One's native country.", "Đất nước quê hương.", "Die Heimat ist schön.", "The homeland is beautiful.", "Quê hương đẹp."),
    ("Heirat", "die", "Heiraten", "marriage", "hôn nhân", "The state of being married.", "Trạng thái kết hôn.", "Die Heirat war gestern.", "The marriage was yesterday.", "Đám cưới diễn ra hôm qua."),
    ("Held", "der", "Helden", "hero", "anh hùng", "A brave person.", "Một người dũng cảm.", "Der Held ist mutig.", "The hero is brave.", "Anh hùng dũng cảm."),
    ("Herr", "der", "Herren", "mister / gentleman", "ông", "A polite term for a man.", "Cách xưng hô lịch sự cho nam giới.", "Herr Müller kommt.", "Mr. Müller is coming.", "Ông Müller đang đến."),
    ("Hilfe", "die", "Hilfen", "help", "giúp đỡ", "Assistance given to someone.", "Sự giúp đỡ cho ai đó.", "Ich brauche Hilfe.", "I need help.", "Tôi cần giúp đỡ."),
    ("Hochzeit", "die", "Hochzeiten", "wedding", "đám cưới", "A marriage ceremony.", "Lễ kết hôn.", "Die Hochzeit ist schön.", "The wedding is beautiful.", "Đám cưới đẹp."),
    ("Höhe", "die", "Höhen", "height", "độ cao", "The measurement of how tall.", "Đo lường mức độ cao.", "Die Höhe ist 100 Meter.", "The height is 100 meters.", "Độ cao 100 mét."),
    ("Höhle", "die", "Höhlen", "cave", "hang động", "A natural underground space.", "Không gian ngầm tự nhiên.", "Die Höhle ist dunkel.", "The cave is dark.", "Hang động tối."),
    ("Holz", "das", "Hölzer", "wood", "gỗ", "Material from trees.", "Vật liệu từ cây.", "Das Holz ist hart.", "The wood is hard.", "Gỗ cứng."),
    ("Honig", "der", "-", "honey", "mật ong", "Sweet substance made by bees.", "Chất ngọt do ong tạo ra.", "Der Honig ist süß.", "The honey is sweet.", "Mật ong ngọt."),
    ("Horn", "das", "Hörner", "horn", "sừng", "A hard projection on animals.", "Phần cứng nhô ra trên động vật.", "Das Horn ist spitz.", "The horn is pointed.", "Sừng nhọn."),
    ("Humor", "der", "-", "humor", "hài hước", "The quality of being funny.", "Tính chất vui nhộn.", "Der Humor ist gut.", "The humor is good.", "Hài hước tốt."),
    ("Hunger", "der", "-", "hunger", "đói", "The feeling of needing food.", "Cảm giác cần thức ăn.", "Ich habe Hunger.", "I am hungry.", "Tôi đói."),
    ("Hüfte", "die", "Hüften", "hip", "hông", "The side of the body.", "Phần bên của cơ thể.", "Die Hüfte tut weh.", "The hip hurts.", "Hông đau."),
    ("Hügel", "der", "Hügel", "hill", "đồi", "A raised area of land.", "Khu vực đất cao.", "Der Hügel ist grün.", "The hill is green.", "Đồi xanh."),
    ("Hütte", "die", "Hütten", "hut / cabin", "túp lều", "A small simple dwelling.", "Nhà ở đơn giản nhỏ.", "Die Hütte ist alt.", "The hut is old.", "Túp lều cũ."),
    ("Hupe", "die", "Hupen", "horn (car)", "còi xe", "A device that makes a warning sound.", "Thiết bị tạo ra âm thanh cảnh báo.", "Die Hupe ist laut.", "The horn is loud.", "Còi xe to."),
    ("Herd", "der", "Herde", "stove", "bếp", "A cooking appliance.", "Thiết bị nấu ăn.", "Der Herd ist heiß.", "The stove is hot.", "Bếp nóng."),
    ("Held", "der", "Helden", "hero", "anh hùng", "A brave person.", "Người dũng cảm.", "Der Held rettet die Stadt.", "The hero saves the city.", "Anh hùng cứu thành phố."),
    ("Hebel", "der", "Hebel", "lever", "đòn bẩy", "A bar for lifting.", "Thanh để nâng.", "Der Hebel ist stark.", "The lever is strong.", "Đòn bẩy chắc."),
    ("Heizung", "die", "Heizungen", "heating", "hệ thống sưởi", "A system for warming.", "Hệ thống làm ấm.", "Die Heizung funktioniert.", "The heating works.", "Hệ thống sưởi hoạt động."),
    ("Helm", "der", "Helme", "helmet", "mũ bảo hiểm", "Protective headgear.", "Đồ bảo vệ đầu.", "Der Helm ist wichtig.", "The helmet is important.", "Mũ bảo hiểm quan trọng."),
]

# Letter I expansions (23 new entries)
i_new_entries = [
    ("Idee", "die", "Ideen", "idea", "ý tưởng", "A thought or suggestion.", "Một suy nghĩ hoặc đề xuất.", "Die Idee ist gut.", "The idea is good.", "Ý tưởng tốt."),
    ("Industrie", "die", "Industrien", "industry", "công nghiệp", "Manufacturing sector.", "Ngành sản xuất.", "Die Industrie wächst.", "The industry is growing.", "Công nghiệp phát triển."),
    ("Infektion", "die", "Infektionen", "infection", "nhiễm trùng", "A disease-causing invasion.", "Sự xâm nhập gây bệnh.", "Die Infektion ist gefährlich.", "The infection is dangerous.", "Nhiễm trùng nguy hiểm."),
    ("Information", "die", "Informationen", "information", "thông tin", "Facts or knowledge.", "Sự thật hoặc kiến thức.", "Die Information ist wichtig.", "The information is important.", "Thông tin quan trọng."),
    ("Ingenieur", "der", "Ingenieure", "engineer", "kỹ sư", "A technical professional.", "Chuyên gia kỹ thuật.", "Der Ingenieur arbeitet.", "The engineer is working.", "Kỹ sư đang làm việc."),
    ("Inhalt", "der", "Inhalte", "content", "nội dung", "What is contained.", "Cái được chứa bên trong.", "Der Inhalt ist interessant.", "The content is interesting.", "Nội dung thú vị."),
    ("Initiative", "die", "Initiativen", "initiative", "sáng kiến", "The ability to take action.", "Khả năng hành động.", "Die Initiative ist gut.", "The initiative is good.", "Sáng kiến tốt."),
    ("Inland", "das", "-", "inland / interior", "nội địa", "The interior of a country.", "Vùng bên trong một quốc gia.", "Das Inland ist groß.", "The inland is large.", "Nội địa rộng lớn."),
    ("Insel", "die", "Inseln", "island", "đảo", "Land surrounded by water.", "Vùng đất bao quanh bởi nước.", "Die Insel ist schön.", "The island is beautiful.", "Hòn đảo đẹp."),
    ("Insekt", "das", "Insekten", "insect", "côn trùng", "A small arthropod animal.", "Động vật chân đốt nhỏ.", "Das Insekt fliegt.", "The insect flies.", "Côn trùng bay."),
    ("Instrument", "das", "Instrumente", "instrument", "dụng cụ", "A tool or musical device.", "Công cụ hoặc nhạc cụ.", "Das Instrument klingt gut.", "The instrument sounds good.", "Nhạc cụ nghe hay."),
    ("Interesse", "das", "Interessen", "interest", "sự quan tâm", "Curiosity or concern.", "Tò mò hoặc quan tâm.", "Das Interesse ist groß.", "The interest is great.", "Sự quan tâm lớn."),
    ("Internet", "das", "-", "internet", "internet", "Global computer network.", "Mạng máy tính toàn cầu.", "Das Internet ist schnell.", "The internet is fast.", "Internet nhanh."),
    ("Interview", "das", "Interviews", "interview", "phỏng vấn", "A formal questioning.", "Một cuộc hỏi han chính thức.", "Das Interview war gut.", "The interview was good.", "Cuộc phỏng vấn tốt."),
    ("Italien", "das", "-", "Italy", "Ý", "A European country.", "Một quốc gia châu Âu.", "Italien ist schön.", "Italy is beautiful.", "Ý đẹp."),
    ("Import", "der", "Importe", "import", "nhập khẩu", "Goods brought into a country.", "Hàng hóa mang vào nước.", "Der Import steigt.", "Imports are rising.", "Nhập khẩu tăng."),
    ("Impfung", "die", "Impfungen", "vaccination", "tiêm chủng", "Immunization shot.", "Mũi tiêm phòng bệnh.", "Die Impfung ist wichtig.", "The vaccination is important.", "Tiêm chủng quan trọng."),
    ("Institut", "das", "Institute", "institute", "viện", "An organization for education.", "Tổ chức cho giáo dục.", "Das Institut ist bekannt.", "The institute is well-known.", "Viện nổi tiếng."),
    ("Instinkt", "der", "Instinkte", "instinct", "bản năng", "Natural impulse.", "Phản ứng tự nhiên.", "Der Instinkt ist stark.", "The instinct is strong.", "Bản năng mạnh."),
    ("Integration", "die", "-", "integration", "hội nhập", "The process of combining.", "Quá trình kết hợp.", "Die Integration ist wichtig.", "Integration is important.", "Hội nhập quan trọng."),
    ("Intelligenz", "die", "-", "intelligence", "trí thông minh", "Mental capability.", "Khả năng trí tuệ.", "Die Intelligenz ist hoch.", "The intelligence is high.", "Trí thông minh cao."),
    ("Intensität", "die", "-", "intensity", "cường độ", "The degree of strength.", "Mức độ mạnh mẽ.", "Die Intensität ist stark.", "The intensity is strong.", "Cường độ mạnh."),
    ("Invasion", "die", "Invasionen", "invasion", "xâm lược", "An attack or intrusion.", "Một cuộc tấn công hoặc xâm nhập.", "Die Invasion war schnell.", "The invasion was quick.", "Cuộc xâm lược nhanh."),
]

# Letter J expansions (20 new entries)
j_new_entries = [
    ("Jacke", "die", "Jacken", "jacket", "áo khoác", "An outer garment.", "Trang phục bên ngoài.", "Die Jacke ist warm.", "The jacket is warm.", "Áo khoác ấm."),
    ("Jagd", "die", "Jagden", "hunt", "cuộc săn", "The pursuit of wild animals.", "Việc theo đuổi động vật hoang dã.", "Die Jagd beginnt.", "The hunt begins.", "Cuộc săn bắt đầu."),
    ("Januar", "der", "-", "January", "tháng Giêng", "The first month.", "Tháng đầu tiên.", "Der Januar ist kalt.", "January is cold.", "Tháng Giêng lạnh."),
    ("Japan", "das", "-", "Japan", "Nhật Bản", "An Asian country.", "Một quốc gia châu Á.", "Japan ist interessant.", "Japan is interesting.", "Nhật Bản thú vị."),
    ("Jazz", "der", "-", "jazz", "nhạc jazz", "A music genre.", "Một thể loại âm nhạc.", "Der Jazz ist cool.", "Jazz is cool.", "Nhạc jazz hay."),
    ("Jeans", "die", "-", "jeans", "quần jean", "Denim trousers.", "Quần vải denim.", "Die Jeans ist blau.", "The jeans are blue.", "Quần jean màu xanh."),
    ("Job", "der", "Jobs", "job", "công việc", "Employment or work.", "Việc làm hoặc công việc.", "Der Job ist gut.", "The job is good.", "Công việc tốt."),
    ("Journalist", "der", "Journalisten", "journalist", "nhà báo", "A news reporter.", "Người viết tin tức.", "Der Journalist schreibt.", "The journalist writes.", "Nhà báo viết."),
    ("Jugend", "die", "-", "youth", "tuổi trẻ", "The time of being young.", "Thời gian còn trẻ.", "Die Jugend ist schön.", "Youth is beautiful.", "Tuổi trẻ đẹp."),
    ("Jugendliche", "der/die", "Jugendlichen", "teenager", "thiếu niên", "A young person.", "Một người trẻ.", "Der Jugendliche lernt.", "The teenager is learning.", "Thiếu niên đang học."),
    ("Juli", "der", "-", "July", "tháng Bảy", "The seventh month.", "Tháng thứ bảy.", "Der Juli ist heiß.", "July is hot.", "Tháng Bảy nóng."),
    ("Juni", "der", "-", "June", "tháng Sáu", "The sixth month.", "Tháng thứ sáu.", "Der Juni ist warm.", "June is warm.", "Tháng Sáu ấm."),
    ("Junge", "der", "Jungen", "boy", "cậu bé", "A male child.", "Trẻ em nam.", "Der Junge spielt.", "The boy is playing.", "Cậu bé đang chơi."),
    ("Justiz", "die", "-", "justice system", "hệ thống tư pháp", "The legal system.", "Hệ thống pháp luật.", "Die Justiz entscheidet.", "The justice system decides.", "Hệ thống tư pháp quyết định."),
    ("Juwel", "das", "Juwelen", "jewel", "ngọc quý", "A precious gem.", "Viên đá quý.", "Das Juwel glänzt.", "The jewel shines.", "Ngọc quý lấp lánh."),
    ("Jäger", "der", "Jäger", "hunter", "thợ săn", "A person who hunts.", "Người đi săn.", "Der Jäger ist stark.", "The hunter is strong.", "Thợ săn mạnh mẽ."),
    ("Joghurt", "der", "Joghurts", "yogurt", "sữa chua", "A dairy product.", "Sản phẩm từ sữa.", "Der Joghurt ist frisch.", "The yogurt is fresh.", "Sữa chua tươi."),
    ("Jubel", "der", "-", "cheering", "hoan hô", "Expressions of joy.", "Biểu hiện vui mừng.", "Der Jubel ist laut.", "The cheering is loud.", "Hoan hô ầm ĩ."),
    ("Jubiläum", "das", "Jubiläen", "anniversary", "kỷ niệm", "A special date.", "Một ngày đặc biệt.", "Das Jubiläum ist wichtig.", "The anniversary is important.", "Kỷ niệm quan trọng."),
    ("Jury", "die", "Jurys", "jury", "bồi thẩm đoàn", "A group judging a case.", "Nhóm xét xử vụ án.", "Die Jury entscheidet.", "The jury decides.", "Bồi thẩm đoàn quyết định."),
]

# Letter K expansions (33 new entries)
k_new_entries = [
    ("Kabel", "das", "Kabel", "cable", "dây cáp", "A thick wire.", "Dây dẫn dày.", "Das Kabel ist lang.", "The cable is long.", "Dây cáp dài."),
    ("Kabine", "die", "Kabinen", "cabin", "cabin", "A small room.", "Một căn phòng nhỏ.", "Die Kabine ist eng.", "The cabin is narrow.", "Cabin hẹp."),
    ("Kaiser", "der", "Kaiser", "emperor", "hoàng đế", "A supreme ruler.", "Người cầm quyền tối cao.", "Der Kaiser regiert.", "The emperor rules.", "Hoàng đế trị vì."),
    ("Kalender", "der", "Kalender", "calendar", "lịch", "A system of organizing days.", "Hệ thống sắp xếp ngày.", "Der Kalender ist voll.", "The calendar is full.", "Lịch đầy."),
    ("Kamera", "die", "Kameras", "camera", "máy ảnh", "A device for photos.", "Thiết bị chụp ảnh.", "Die Kamera ist neu.", "The camera is new.", "Máy ảnh mới."),
    ("Kamm", "der", "Kämme", "comb", "lược", "A tool for hair.", "Công cụ chải tóc.", "Der Kamm ist klein.", "The comb is small.", "Lược nhỏ."),
    ("Kammer", "die", "Kammern", "chamber", "phòng", "A room or cavity.", "Một căn phòng hoặc khoang.", "Die Kammer ist dunkel.", "The chamber is dark.", "Phòng tối."),
    ("Kampf", "der", "Kämpfe", "fight / struggle", "cuộc chiến", "A battle or conflict.", "Một trận chiến hoặc xung đột.", "Der Kampf ist hart.", "The fight is hard.", "Cuộc chiến khó khăn."),
    ("Kanal", "der", "Kanäle", "canal / channel", "kênh", "A waterway or TV channel.", "Đường nước hoặc kênh truyền hình.", "Der Kanal ist breit.", "The canal is wide.", "Kênh rộng."),
    ("Kandidat", "der", "Kandidaten", "candidate", "ứng viên", "A person running for office.", "Người tranh cử.", "Der Kandidat spricht.", "The candidate speaks.", "Ứng viên phát biểu."),
    ("Kanne", "die", "Kannen", "pot / jug", "bình", "A container for liquids.", "Bình chứa chất lỏng.", "Die Kanne ist voll.", "The pot is full.", "Bình đầy."),
    ("Kantine", "die", "Kantinen", "canteen / cafeteria", "căng tin", "A dining facility.", "Cơ sở ăn uống.", "Die Kantine ist groß.", "The canteen is large.", "Căng tin lớn."),
    ("Kapitel", "das", "Kapitel", "chapter", "chương", "A section of a book.", "Một phần của cuốn sách.", "Das Kapitel ist lang.", "The chapter is long.", "Chương dài."),
    ("Kapital", "das", "-", "capital", "vốn", "Financial assets.", "Tài sản tài chính.", "Das Kapital ist wichtig.", "Capital is important.", "Vốn quan trọng."),
    ("Karte", "die", "Karten", "card / map", "thẻ / bản đồ", "A piece of cardboard or map.", "Tấm bìa hoặc bản đồ.", "Die Karte ist bunt.", "The card is colorful.", "Thẻ nhiều màu."),
    ("Kartoffel", "die", "Kartoffeln", "potato", "khoai tây", "A starchy vegetable.", "Rau củ chứa tinh bột.", "Die Kartoffel ist groß.", "The potato is large.", "Khoai tây to."),
    ("Kasse", "die", "Kassen", "cash register / checkout", "quầy thu ngân", "A place for payment.", "Nơi thanh toán.", "Die Kasse ist offen.", "The checkout is open.", "Quầy thu ngân mở."),
    ("Kasten", "der", "Kästen", "box / case", "hộp", "A container.", "Một vật chứa.", "Der Kasten ist schwer.", "The box is heavy.", "Hộp nặng."),
    ("Katalog", "der", "Kataloge", "catalog", "danh mục", "A list of items.", "Danh sách các mục.", "Der Katalog ist dick.", "The catalog is thick.", "Danh mục dày."),
    ("Katastrophe", "die", "Katastrophen", "catastrophe", "thảm họa", "A disaster.", "Một tai họa.", "Die Katastrophe ist groß.", "The catastrophe is large.", "Thảm họa lớn."),
    ("Keller", "der", "Keller", "cellar / basement", "tầng hầm", "An underground room.", "Căn phòng dưới đất.", "Der Keller ist dunkel.", "The cellar is dark.", "Tầng hầm tối."),
    ("Kerze", "die", "Kerzen", "candle", "nến", "A wax light source.", "Nguồn sáng từ sáp.", "Die Kerze brennt.", "The candle burns.", "Nến cháy."),
    ("Kette", "die", "Ketten", "chain", "dây xích", "Connected metal links.", "Các mắt xích kim loại nối.", "Die Kette ist lang.", "The chain is long.", "Dây xích dài."),
    ("Kilometer", "der", "Kilometer", "kilometer", "kilômét", "A unit of distance.", "Đơn vị khoảng cách.", "Der Weg ist 5 Kilometer.", "The way is 5 kilometers.", "Đường dài 5 kilômét."),
    ("Kino", "das", "Kinos", "cinema", "rạp chiếu phim", "A movie theater.", "Rạp chiếu phim.", "Das Kino ist voll.", "The cinema is full.", "Rạp chiếu phim đông."),
    ("Kirche", "die", "Kirchen", "church", "nhà thờ", "A place of worship.", "Nơi thờ phụng.", "Die Kirche ist alt.", "The church is old.", "Nhà thờ cũ."),
    ("Kissen", "das", "Kissen", "pillow / cushion", "gối", "A soft head support.", "Đồ nâng đỡ đầu mềm.", "Das Kissen ist weich.", "The pillow is soft.", "Gối mềm."),
    ("Klasse", "die", "Klassen", "class", "lớp", "A group of students.", "Một nhóm học sinh.", "Die Klasse ist groß.", "The class is large.", "Lớp học lớn."),
    ("Klavier", "das", "Klaviere", "piano", "đàn piano", "A musical instrument.", "Nhạc cụ.", "Das Klavier klingt schön.", "The piano sounds beautiful.", "Đàn piano nghe hay."),
    ("Klinik", "die", "Kliniken", "clinic / hospital", "phòng khám", "A medical facility.", "Cơ sở y tế.", "Die Klinik ist modern.", "The clinic is modern.", "Phòng khám hiện đại."),
    ("Knie", "das", "Knie", "knee", "đầu gối", "The joint in the leg.", "Khớp ở chân.", "Das Knie tut weh.", "The knee hurts.", "Đầu gối đau."),
    ("Knopf", "der", "Knöpfe", "button", "nút", "A fastener on clothing.", "Đồ cài trên quần áo.", "Der Knopf ist klein.", "The button is small.", "Nút nhỏ."),
    ("König", "der", "Könige", "king", "vua", "A male monarch.", "Vị vua.", "Der König regiert.", "The king rules.", "Vua trị vì."),
]

def expand_letter(letter, new_entries, filepath):
    """Expand a letter file with new entries"""
    global next_id
    
    # Load existing data
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Add new entries
    for entry_data in new_entries:
        entry_id, entry = create_entry(*entry_data)
        
        word_lower = entry['word'].lower()
        
        # Add to byWord
        data['byWord'][word_lower] = entry_id
        
        # Add to byEnglish
        if entry['english'] not in data['byEnglish']:
            data['byEnglish'][entry['english']] = []
        data['byEnglish'][entry['english']].append(entry_id)
        
        # Add to byVietnamese
        if entry['vietnamese'] not in data['byVietnamese']:
            data['byVietnamese'][entry['vietnamese']] = []
        data['byVietnamese'][entry['vietnamese']].append(entry_id)
        
        # Add to byArtikel
        artikel = entry['artikel']
        if artikel not in data['byArtikel']:
            data['byArtikel'][artikel] = []
        data['byArtikel'][artikel].append(entry_id)
        
        # Add to entries
        data['entries'][entry_id] = entry
    
    # Save updated data
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Expanded {letter}.json: +{len(new_entries)} entries (total: {len(data['entries'])})")

def main():
    base_path = 'public/data/dictionary/letters'
    
    print("Starting Phase 2 Dictionary Expansion...")
    print(f"Starting from ID: ID{str(next_id).zfill(3)}\n")
    
    # Expand each letter
    expand_letter('G', g_new_entries, f'{base_path}/g.json')
    expand_letter('H', h_new_entries, f'{base_path}/h.json')
    expand_letter('I', i_new_entries, f'{base_path}/i.json')
    expand_letter('J', j_new_entries, f'{base_path}/j.json')
    expand_letter('K', k_new_entries, f'{base_path}/k.json')
    
    print(f"\n✓ Phase 2 expansion complete!")
    print(f"Next ID: ID{str(next_id).zfill(3)}")
    print(f"Total new entries added: {len(g_new_entries) + len(h_new_entries) + len(i_new_entries) + len(j_new_entries) + len(k_new_entries)}")

if __name__ == '__main__':
    main()
