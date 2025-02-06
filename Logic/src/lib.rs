use calimero_sdk::borsh::{BorshDeserialize, BorshSerialize};
use calimero_sdk::serde::Serialize;
use calimero_sdk::{app, env};

#[app::state(emits = for<'a> Event<'a>)]
#[derive(BorshDeserialize, BorshSerialize, Default)]
#[borsh(crate = "calimero_sdk::borsh")]
pub struct ImageShare {
    all_images: Vec<ImageEntry>,
}

#[derive(BorshDeserialize, BorshSerialize, Default, Serialize)]
#[borsh(crate = "calimero_sdk::borsh")]
#[serde(crate = "calimero_sdk::serde")]
pub struct ImageEntry {
    username: String,
    images: Vec<String>,
}

#[app::event]
pub enum Event<'a> {
    ImageAdded {
        username: &'a str,
        image: &'a str,
    },
    NameAdded {
        username: &'a str,
    },
}

#[app::logic]
impl ImageShare {
    #[app::init]
    pub fn init() -> ImageShare {
        ImageShare::default()
    }

    pub fn get_all_entries(&self) -> &[ImageEntry] {
        env::log("Getting all image entries.");
        &self.all_images
    }

    pub fn add_image(&mut self, username: String, image: String) -> &ImageEntry {
        env::log(&format!("Adding image for user: {:?} with image: {:?}", username, image));

        app::emit!(Event::ImageAdded {
            username: &username,
            image: &image,
        });

        // Find the entry index first
        if let Some(index) = self.all_images.iter().position(|entry| entry.username == username) {
            self.all_images[index].images.push(image);
            return &self.all_images[index];
        }

        // If not found, push a new entry
        self.all_images.push(ImageEntry {
            username: username.clone(),
            images: vec![image],
        });

        self.all_images.last().unwrap()
    }

    pub fn add_name(&mut self, username: String) -> &ImageEntry {
        env::log(&format!("Adding new name: {:?}", username));

        app::emit!(Event::NameAdded {
            username: &username,
        });

        self.all_images.push(ImageEntry {
            username: username.clone(),
            images: Vec::new(),
        });

        self.all_images.last().unwrap()
    }
}