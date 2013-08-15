module Gluttonberg
  class LocaleObserver < ActiveRecord::Observer
    observe Locale
    
    def after_create(locale)   
      Page.all.each do |page|
        #create localizations for all pages for new locale
        new_localizations = create_page_localization(page, locale)
        
        # create content localizations
        unless page.description.sections.empty?
          Rails.logger.info("Generating stubbed content for all pages using new localizations")
          page.description.sections.each do |name, section|
            # Create the content
            create_page_content(page, new_localizations, name, section)
          end
        end
      end
    end

      
    
    def after_update(locale)
      existing_localization_ids = []
      remove_list = []
      new_localizations = []
    end 

    private
      def create_page_localization(page, locale)
        new_localizations = []
        new_localizations << page.localizations.create(
          :name     => page.name,
          :locale_id   => locale.id
        )
        new_localizations
      end 

      def create_page_content(page, new_localizations, name, section)
        association = page.send(section[:type].to_s.pluralize)
        content = association.where(:section_name => name).first
        # Create each localization
        if content && content.class.localized?
          new_localizations.each do |localization|
            content.localizations.create(:parent => content, :page_localization => localization)
          end
        end
      end
        
  end
end