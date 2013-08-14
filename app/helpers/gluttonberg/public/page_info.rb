# encoding: utf-8

module Gluttonberg
  module Public
    module PageInfo
      def page_title
        title_setting = Gluttonberg::Setting.get_setting("title")
        page_title = _prepare_page_title

        if page_title.blank?
          title_setting
        elsif title_setting.blank?
          page_title
        else
          "#{page_title} | #{title_setting}"
        end
      end

      def page_description
        object = find_current_object_for_meta_tags
        description_settings = Gluttonberg::Setting.get_setting("description")
        page_description = if !object.blank? && object.respond_to?(:seo_description)
          object.seo_description
        end

        if !page_description.blank?
          page_description
        else !description_settings.blank?
          description_settings
        end
      end

      def page_keywords
        object = find_current_object_for_meta_tags
        keywords_settings = Gluttonberg::Setting.get_setting("keywords")
        page_keywords = if !object.blank? && object.respond_to?(:seo_keywords)
          object.seo_keywords
        end

        if !page_keywords.blank?
          page_keywords
        elsif !keywords_settings.blank?
          keywords_settings
        end
      end

      def page_fb_icon_path
        path = nil
        object = find_current_object_for_meta_tags
        fb_icon_id = Gluttonberg::Setting.get_setting("fb_icon")

        if !object.blank? && object.respond_to?(:fb_icon_id) && !object.fb_icon_id.blank?
          fb_icon_id = object.fb_icon_id
        end

        asset = unless fb_icon_id.blank?
          Asset.where(:id => fb_icon_id).first
        end

        path = asset.url unless asset.blank?
        path
      end

      def body_class(page=nil)
        page = @page if page.blank?
        if !page.blank?
         "page #{page.current_localization.slug.blank? ? page.slug : page.current_localization.slug} #{page.home? ? 'home' : ''}"
        else
          [@article, @blog, @custom_model_object].each do |object|
            unless object.blank?
              class_name = (object.kind_of?(Gluttonberg::Article) ? 'post' : object.class.name.demodulize.downcase)
              return "#{class_name} #{object.slug}"
            end
          end
        end
      end

      private

        def find_current_object_for_meta_tags
          if !@page.blank?
            @page.current_localization
          elsif !@article.blank?
            @article.current_localization
          elsif !@blog.blank?
            @blog
          elsif !@custom_model_object.blank?
            @custom_model_object
          end
        end

        def _prepare_page_title
          object = find_current_object_for_meta_tags
          page_title = if !object.blank? && object.respond_to?(:seo_title)
            object.seo_title
          end

          page_title = @page.title if page_title.blank? && !@page.blank?
          page_title = @article.title if page_title.blank? && !@article.blank?
          page_title = @blog.name if page_title.blank? && !@blog.blank?
          page_title = @custom_model_object.title_or_name? if page_title.blank? && !@custom_model_object.blank? && @custom_model_object.respond_to?(:title_or_name?)
          page_title
        end
    end
  end
end