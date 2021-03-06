module Gluttonberg
  # Page content for plain text area. All content/localization related functionality 
  # is provided Content::Block mixin 
  # Stores user input in :text column all other information is just meta information
  class TextareaContent  < ActiveRecord::Base
    include Content::Block
    self.table_name = "gb_textarea_contents"
    attr_accessible :text

    is_localized do
      attr_accessible :text
    end
  end
end