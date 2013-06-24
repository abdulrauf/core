# encoding: utf-8

module Gluttonberg
  module Admin
    module Content
      class PagesController < Gluttonberg::Admin::BaseController
        drag_tree Page , :route_name => :admin_page_move
        before_filter :find_page, :only => [:show, :edit, :delete, :update, :destroy]
        before_filter :authorize_user , :except => [:destroy , :delete]
        before_filter :authorize_user_for_destroy , :only => [:destroy , :delete]
        record_history :@page

        def index
          @pages = Page.find(:all , :conditions => { :parent_id => nil } , :order => 'position' )
        end

        def show
        end

        def new
          @page = Page.new
          @page_localization = PageLocalization.new
          prepare_to_edit
        end

        def delete
          default_localization = Gluttonberg::PageLocalization.find(:first , :conditions => { :page_id => @page.id , :locale_id => Gluttonberg::Locale.first_default.id } )
          display_delete_confirmation(
            :title      => "Delete “#{default_localization.name}” page?",
            :url        => admin_page_url(@page),
            :return_url => admin_pages_path ,
            :warning    => "Children of this page will also be deleted."
          )
        end

        def create
          @page = Page.new(params["gluttonberg_page"])
          @page.state = "draft"
          @page.published_at = nil
          @page.user_id = current_user.id
          if @page.save
            @page.create_default_template_file
            flash[:notice] = "The page was successfully created."
            default_localization = Gluttonberg::PageLocalization.where(:page_id => @page.id , :locale_id => Gluttonberg::Locale.first_default.id).first
            redirect_to edit_admin_page_page_localization_path( :page_id => @page.id, :id => default_localization.id)
          else
            prepare_to_edit
            render :new
          end
        end


        def destroy
          if @page.destroy
            flash[:notice] = "The page was successfully deleted."
            redirect_to admin_pages_path
          else
            flash[:error] = "There was an error deleting the page."
            redirect_to admin_pages_path
          end
        end

        def edit_home
          @current_home_page_id  = Page.home_page.id unless Page.home_page.blank?
          @pages = Page.all
        end

        def update_home
          @new_home = Page.where(:id => params[:home]).first
          unless @new_home.blank?
            @new_home.update_attributes(:home => true)
          else
            @old_home = Page.where(:home => true).first
            @old_home.update_attributes(:home => false)
          end
          Gluttonberg::Feed.log(current_user,@new_home,@new_home.name , "set as home")
          render :text => "Home page is changed"
        end

        def pages_list_for_tinymce
          @pages = Page.published.count
          @pages = Page.published.where("not(description_name = 'top_level_page')").order('position' )

          @articles_count = Article.published.count
          @blogs = Blog.published.order("name ASC")

          render :layout => false
        end

        def duplicate
          @page = Page.find(params[:id])
          @duplicated_page = @page.duplicate
          @duplicated_page.user_id = current_user.id
          if @duplicated_page
            flash[:notice] = "The page was successfully duplicated."
            default_localization = Gluttonberg::PageLocalization.find(:first , :conditions => { :page_id => @duplicated_page.id , :locale_id => Gluttonberg::Locale.first_default.id } )
            redirect_to edit_admin_page_page_localization_path( :page_id => @duplicated_page.id, :id => default_localization.id)
          else
            flash[:error] = "There was an error duplicating the page."
            redirect_to admin_pages_path
          end
        end

        private

        def prepare_to_edit
          @pages  = params[:id] ? Page.where("id  != ? " , params[:id]).all : Page.all
          @descriptions = []
          Gluttonberg::PageDescription.all.each do |name, desc|
            @descriptions << [desc[:description], name]
          end
        end

        def find_page
          @page = Page.find( params[:id])
          raise ActiveRecord::RecordNotFound unless @page
        end

        def authorize_user
          authorize! :manage, Gluttonberg::Page
        end

        def authorize_user_for_destroy
          authorize! :destroy, Gluttonberg::Page
        end

      end
    end #content
  end #admin
end  #gluttonberg
